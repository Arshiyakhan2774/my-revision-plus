import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '@wiris/mathtype-tinymce5';

const RichTextEditor = () => {
  const [editorContent, setEditorContent] = useState('<p>This is the initial content of the editor</p>');
  const [showContent, setShowContent] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    script.async = true;
    
    script.onload = () => {
      if (window.Wiris) {
        window.Wiris.config.saveMode = 'xml';
      }
    };

    script.onerror = () => {
      console.error('Failed to load Wiris script.');
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const logContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setEditorContent(content);
      setShowContent(true);
      setTimeout(() => {
        forceMathTypeRendering();
      }, 100);
    }
  };

  const forceMathTypeRendering = () => {
    if (window.Wiris && window.Wiris.Plugin && window.Wiris.Plugin.Viewer) {
      window.Wiris.Plugin.Viewer.parseElement();
    }
  };

  return (
    <div>
      <Editor
        apiKey="your-api-key"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={editorContent}
        init={{
          height: 500,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'tiny_mce_wiris',
            'code'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | code',
          setup: (editor) => {
            editor.on('change', () => {
              setEditorContent(editor.getContent());
            });
          }
        }}
      />
      <button onClick={logContent} style={{ marginTop: '20px' }}>Show Content</button>
      {showContent && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
          <h3>Editor Content:</h3>
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
