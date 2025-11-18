import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_ESCOOP,
  UPDATE_ESCOOP,
  type CreateEscoopVariables,
  type CreateEscoopData,
  type UpdateEscoopVariables,
  type UpdateEscoopData
} from '@/lib/graphql/escoops';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import type { ApolloError } from '@apollo/client';

interface UseSaveEscoopProps {
  escoopData?: {
    id?: string;
    name: string;
    title?: string;
    sendDate?: string;
    remaining?: number;
    bannersRemaining?: number;
    market?: string;
    locations?: string[];
  };
}

interface UseSaveEscoopReturn {
  saveEscoop: () => Promise<boolean>;
  loading: boolean;
  error: ApolloError | undefined;
}


export function useSaveEscoop({ escoopData }: UseSaveEscoopProps): UseSaveEscoopReturn {

  // Determine if we're creating or updating
  const isUpdate = !!escoopData?.id;

  const [createEscoopMutation, { loading: createLoading, error: createError }] = useMutation<CreateEscoopData, CreateEscoopVariables>(
    CREATE_ESCOOP,
    {
      onCompleted: (data) => {
        if (data.createEscoop) {
          toast.success('eScoop created successfully!');
          console.log('eScoop created:', data.createEscoop);
        }
      },
      onError: (error) => {
        console.error('Error creating eScoop:', error);
        toast.error('Failed to create eScoop: ' + error.message);
      }
    }
  );

  const [updateEscoopMutation, { loading: updateLoading, error: updateError }] = useMutation<UpdateEscoopData, UpdateEscoopVariables>(
    UPDATE_ESCOOP,
    {
      onCompleted: (data) => {
        if (data.updateEscoop) {
          toast.success('eScoop updated successfully!');
          console.log('eScoop updated:', data.updateEscoop);
        }
      },
      onError: (error) => {
        console.error('Error updating eScoop:', error);
        toast.error('Failed to update eScoop: ' + error.message);
      }
    }
  );

  const saveEscoop = async (): Promise<boolean> => {
    try {
      if (!escoopData) {
        toast.error('Missing escoop data');
        return false;
      }

      // ✅ READ FRESH DATA FROM STORE AT SAVE TIME
      const currentState = useEscoopBuilderStore.getState();
      const { selectedRestaurants, selectedFeaturedEvents, settings } = currentState;

      // Debug: Log fresh store data at save time
      console.log('🔍 FRESH STORE DATA AT SAVE TIME:');
      console.log('Store selectedRestaurants:', selectedRestaurants);
      console.log('Store selectedFeaturedEvents:', selectedFeaturedEvents);
      console.log('Store settings:', settings);
      console.log('Store settings.selectedTemplate:', settings.selectedTemplate);
      console.log('Store settings.subjectLine:', settings.subjectLine);

      // Prepare restaurant IDs (only selected ones)
      const restaurantIds = selectedRestaurants
        .filter(restaurant => restaurant.isSelected)
        .map(restaurant => restaurant.id);

      // Prepare featured event IDs (only selected ones)
      const featuredEventIds = selectedFeaturedEvents
        .filter(event => event.isSelected)
        .map(event => event.id);

      // Debug: Log arrays to verify data
      console.log('🔍 Debug Save Data:');
      console.log('Total restaurants in store:', selectedRestaurants.length);
      console.log('Selected restaurants:', selectedRestaurants.filter(r => r.isSelected));
      console.log('Restaurant IDs to send:', restaurantIds);
      console.log('Total featured events in store:', selectedFeaturedEvents.length);
      console.log('Selected featured events:', selectedFeaturedEvents.filter(e => e.isSelected));
      console.log('Featured event IDs to send:', featuredEventIds);
      console.log('Selected template:', settings.selectedTemplate);
      console.log('Subject line:', settings.subjectLine);
      console.log('Selected Brevo Lists:', settings.selectedBrevoLists);
      console.log('Selected Brevo Segments:', settings.selectedBrevoSegments);

      // Common data for both create and update
      const commonData = {
        name: escoopData.name,
        title: escoopData.title || settings.subjectLine || 'eScoop Newsletter',
        sendDate: escoopData.sendDate || new Date().toISOString(),
        market: escoopData.market || 'miami',
        ...(escoopData.remaining && { remaining: escoopData.remaining }),
        ...(escoopData.bannersRemaining && { bannersRemaining: escoopData.bannersRemaining }),
        ...(escoopData.locations && escoopData.locations.length > 0 && { locations: escoopData.locations }),

        // ✅ SIEMPRE incluir arrays (aunque estén vacíos)
        restaurantIds: restaurantIds,
        featuredEventIds: featuredEventIds,

        settings: {
          subjectLine: settings.subjectLine || '🎭 Cultural Events This Week',
          templateName: settings.selectedTemplate || 'classic-newsletter', // ✅ Usar template seleccionado
          brevoLists: settings.selectedBrevoLists || [], // ✅ Incluir listas de Brevo seleccionadas
          brevoSegments: settings.selectedBrevoSegments || [], // ✅ Incluir segmentos de Brevo seleccionados
          sendNow: false,
          scheduleDate: settings.scheduledDate
            ? settings.scheduledDate.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          scheduleTime: settings.scheduledDate
            ? settings.scheduledDate.toISOString().split('T')[1]?.substring(0, 5)
            : '10:00',
          timezone: 'America/New_York'
        }
      };

      // Debug: Log final data being sent
      console.log('🚀 Final data to send:', JSON.stringify(commonData, null, 2));

      let result;

      if (isUpdate) {
        // ✅ Update existing escoop
        console.log('Updating escoop with data:', { id: escoopData.id, ...commonData });

        result = await updateEscoopMutation({
          variables: {
            updateEscoopInput: {
              id: escoopData.id!, // ✅ Required for update
              ...commonData
            }
          }
        });

        // ✅ Debug: Log what we got back from the backend
        console.log('🔍 Backend Response:', JSON.stringify(result.data?.updateEscoop, null, 2));
        console.log('🔍 Restaurants in response:', result.data?.updateEscoop?.restaurants);
        console.log('🔍 FeaturedEvents in response:', result.data?.updateEscoop?.featuredEvents);
        console.log('🔍 Settings in response:', result.data?.updateEscoop?.settings);

        return !!result.data?.updateEscoop;
      } else {
        // ✅ Create new escoop
        console.log('Creating escoop with data:', commonData);

        result = await createEscoopMutation({
          variables: {
            createEscoopInput: commonData
          }
        });

        return !!result.data?.createEscoop;
      }
    } catch (error) {
      console.error('Error in saveEscoop:', error);
      return false;
    }
  };

  return {
    saveEscoop,
    loading: createLoading || updateLoading,
    error: createError || updateError
  };
}