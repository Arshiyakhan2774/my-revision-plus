// // EditorFile.jsx
// import React, { forwardRef, useRef } from 'react';  // Add the import for forwardRef
// import { Editor } from '@tinymce/tinymce-react'; 
// import '@wiris/mathtype-tinymce5';
// import 'tinymce/skins/content/default/content.css';

// const EditorFile = forwardRef(({ content, onEditorChange }, ref) => {
//   const editorRef = useRef(null);
//   return (
//     <div>
//       <Editor
//         apiKey="your-api-key"
//         onInit={(evt, editor) => (editorRef.current = editor)}
//         init={{
//               menubar: 'file edit view insert format tools table help',
//           plugins: [
//             'advlist autolink lists link image charmap print preview anchor',
//             'searchreplace visualblocks code fullscreen',
//             'insertdatetime media table paste code help wordcount',
//             'tiny_mce_wiris',
//           ],
//           toolbar:
//             'undo redo | formatselect | bold italic backcolor | ' +
//             'alignleft aligncenter alignright alignjustify | ' +
//             'bullist numlist outdent indent | removeformat | help | ' +
//             'image | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
//           content_style: `
//             body {
//         padding: 0;
//         margin: 0;
//         font-family: Arial, sans-serif;
//       }
//          `,
//           file_picker_callback: (callback, value, meta) => {
//             if (meta.filetype === 'image') {
//               const input = document.createElement('input');
//               input.setAttribute('type', 'file');
//               input.setAttribute('accept', 'image/*');
//               input.onchange = () => {
//                 const file = input.files[0];
//                 if (file) {
//                   const reader = new FileReader();
//                   reader.onload = (event) => {
//                     callback(event.target.result, {
//                       alt: file.name,
//                       title: file.name,
//                     });
//                   };
//                   reader.readAsDataURL(file);
//                 }
//               };
//               input.click();
//             }
//           },
//           setup: (editor) => {
//             editor.on('drop', (e) => {
//               const files = e.dataTransfer.files;
//               if (files.length > 0) {
//                 e.preventDefault();
//                 const reader = new FileReader();
//                 reader.onload = (event) => {
//                   editor.insertContent(
//                     `<div style="text-align: center; margin: 20px 0;"><img src="${event.target.result}" style="margin: 0 auto;" /></div>`
//                   );
//                 };
//                 reader.readAsDataURL(files[0]);
//               }
//             });
//           },
//         }}
//         value={content}
//         onEditorChange={onEditorChange}
//       />
//     </div>
//   );
// });

// export default EditorFile;
// EditorFile.jsx
import React, { forwardRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '@wiris/mathtype-tinymce5';

const EditorFile = forwardRef(({ content, onEditorChange }, ref) => {
  return (
    <div className="w-full">
      <Editor
        apiKey="your-api-key"
        init={{
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'tiny_mce_wiris'
          ],
          toolbar: 
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | image | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
          content_style: `
            body {
              font-family: Inter, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              color: #333;
              margin: 0;
              padding: 8px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            /* Fix Wiris container styles */
            .WirisformulaContainer {
              display: inline-block;
              vertical-align: middle;
            }
            /* Fix Wiris formula styles */
            .Wirisformula {
              color: inherit;
              background: transparent;
            }
          `,
          skin: 'oxide',
          content_css: false, // Disable default content CSS to prevent conflicts
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.onchange = () => {
                const file = input.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    callback(e.target.result, {
                      alt: file.name,
                      title: file.name,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }
          },
          setup: (editor) => {
            editor.on('drop', (e) => {
              const files = e.dataTransfer.files;
              if (files.length > 0 && files[0].type.includes('image')) {
                e.preventDefault();
                const reader = new FileReader();
                reader.onload = (event) => {
                  editor.insertContent(
                    `<img src="${event.target.result}" class="mx-auto my-2 max-w-full h-auto" />`
                  );
                };
                reader.readAsDataURL(files[0]);
              }
            });
          },
        }}
        value={content}
        onEditorChange={onEditorChange}
      />
    </div>
  );
});

export default EditorFile;