import React from 'react';

import { flushSync } from 'react-dom';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { useState } from 'react';
import { useContext } from 'react';
import email_context from '../../context/email_context';
import('./AddPost.css');

let files = [];
let data;
let fl_id;

function AddPost({ count, setCount }) {
  let { i_email, set_i_email } = useContext(email_context);
  let [files, setFiles] = useState([]);
  let temp_count;

  function handleSubmit(e) {
    e.preventDefault();

    console.log(-5000, count);
    console.log(123, e.target.shortText.value);
    console.log(124, i_email);
    console.log(125, files);
    if (!i_email == '') {
      fetch('http://localhost:4001/api/posts', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          shortText: e.target.shortText.value,
          i_email: i_email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          console.log(50000, json._id);
          fl_id = json._id;
          temp_count = count + 1;
          flushSync(() => {
            setCount(temp_count);
          });

          setTimeout(() => {
            if (!i_email == '' && !files.length == 0) {
              console.log('урр', files);

              if (files.length) {
                // packFiles(files);
                for (let i = 0; i < files.length; i++) {
                  console.log(8001, files[i]);
                  const data = new FormData();

                  data.append('file', files[i]);
                  console.log(700, files[i]);
                  console.log('data', data);
                  setTimeout(() => {
                    fetch(`http://localhost:4001/api/posts/${fl_id}`, {
                      method: 'PATCH',
                      body: data,
                    })
                      .then((res) => {
                        return res.json();
                        console.log(res);

                        temp_count = count + 1;
                        flushSync(() => {
                          setCount(temp_count);
                        });
                      })
                      .then((json) => console.log(json))
                      .catch((error) => console.log(error));
                  }, 3000);
                }
              }
            }
          }, 5000);
        })
        .catch((error) => console.log(error));

      e.target.shortText.value = '';
      setTimeout(() => {
        setFiles([]);
        setCount(count++);
      }, 5000);
    } else {
      alert('нужно войти в систему');
    }
  }
  const renderFileList = () => (
    <ol>
      {[...files].map((f, i) => (
        <li key={i}>
          {f.name} - {f.type}
        </li>
      ))}
    </ol>
  );
  /*
  function packFiles(files) {
    const formData = new FormData();
    [...files].forEach((file) => {
      formData.append(`file`, file);
      console.log(10501, file);
      data = formData;
    });
    return data;
  }
*/
  return (
    <div className='addPost_flex'>
      <form action='' onSubmit={handleSubmit} className='AddPost_form'>
        <h1>Ввод объявления</h1>
        <label>
          Вввести объявление:
          <input type='text' name='shortText' className='AddPost_input' />
        </label>
        <label>
          Добавить файл:
          <input
            type='file'
            multiple
            onChange={(e) => {
              setFiles(e.target.files);
            }}
            className='AddPost_input'
          />
          {renderFileList()}
        </label>

        <button className='AddPost_button' type='submit'>
          разместить объявление
        </button>
      </form>
    </div>
  );
}

export default AddPost;
