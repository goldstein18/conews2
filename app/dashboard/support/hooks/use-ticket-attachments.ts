import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_TICKET_ATTACHMENT_UPLOAD_URL } from '@/lib/graphql/tickets';
import { GenerateTicketAttachmentUploadUrlResponse } from '@/types/ticket';

export function useTicketAttachments() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  const [generateUrlMutation] = useMutation<GenerateTicketAttachmentUploadUrlResponse>(
    GENERATE_TICKET_ATTACHMENT_UPLOAD_URL
  );

  const uploadFile = async (ticketId: string, file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Step 1: Generate presigned URL
      const { data } = await generateUrlMutation({
        variables: {
          generateAttachmentUploadUrlInput: {
            ticketId,
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
          },
        },
      });

      if (!data?.generateTicketAttachmentUploadUrl) {
        throw new Error('Failed to generate upload URL');
      }

      const { uploadUrl, key, maxFileSize } = data.generateTicketAttachmentUploadUrl;

      // Validate file size
      if (file.size > maxFileSize) {
        throw new Error(`File size exceeds maximum allowed size of ${maxFileSize / 1024 / 1024}MB`);
      }

      // Step 2: Upload to S3
      const xhr = new XMLHttpRequest();

      await new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      toast.success('File uploaded successfully');
      return key;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(message);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleFiles = async (ticketId: string, files: File[]): Promise<string[]> => {
    const uploadedKeys: string[] = [];

    for (const file of files) {
      const key = await uploadFile(ticketId, file);
      if (key) {
        uploadedKeys.push(key);
      }
    }

    return uploadedKeys;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    uploadProgress,
  };
}
