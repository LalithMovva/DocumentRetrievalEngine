import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Home() {
    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        navigate('/login')
    }
    const onFileChange = event => {
	
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
        
        }
        

    // state = {

    //     // Initially, no file is selected
    //     selectedFile: null,
    //   checkFile: null
    //     };
    const fileData = () => {
	
        if (this.state.selectedFile) {
            
            return (
            <div>
                <h2>File Details:</h2>
                <p>File Name: {this.state.selectedFile.name}</p>
    
                <p>File Type: {this.state.selectedFile.type}</p>
    
                <p>
                Last Modified:{" "}
                {this.state.selectedFile.lastModifiedDate.toDateString()}
                </p>
    
            </div>
            );
        } else {
            return (
            <div>
                <br />
                <h4>Choose before Pressing the Upload button</h4>
            </div>
            );
        }
        }

       const onFileUpload = () => {
	
            // Create an object of formData
            const formData = new FormData();
            
            // Update the formData object
            formData.append('File',this.state.selectedFile);
          console.log(Object.fromEntries(formData.entries()))
            
            // Details of the uploaded file
            //console.log(this.state.selectedFile);
            
            // Request made to the backend api
            // Send formData object
            axios.post("api/uploadfile", formData, {responseType: 'arraybuffer'}).then(res => 
            {
              const file = new Blob(
                [res.data], 
                {type: 'application/pdf'});
                //console.log(res.data);
          //Build a URL from the file
                //console.log(res.data)
              const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
              window.open(fileURL);
            }
            )
          //   .then(
          //   data => {
          //       //set_image_loc(data.img);
                
          //       this.setState({checkFile : new File(
          //         [data], "check.pdf"
          //     ) });
          //       console.log(this.state.checkFile.name)
          //   }
          // );
            }

    let navigate = useNavigate();
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        console.log(authToken)
        if (authToken) {
            navigate('/home')
        }

        if (!authToken) {
            navigate('/login')
        }
    }, [])
    return (
    
            <div>
                <h3>
                File Upload using React!
                </h3>
                <div>
                    <input type="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>
                    Upload!
                    </button>
                </div>
            {fileData()}
             <button onClick={handleLogout}>Log out</button>
            </div>
    )
}