'use client';

// Re-export NovelEditor for direct imports (will still work with dynamic import from NovelEditorField)
export { NovelEditor } from './novel-editor';

// Primary export - use this in forms (handles dynamic loading automatically)
export { NovelEditorField } from './novel-editor-field';
