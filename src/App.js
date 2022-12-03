// import logo from './logo.svg';
// import './App.css';
// import React, { useState, useEffect } from "react";

// import axios from 'axios';



// function App() {

//   const state = {
  
//     // Initially, no file is selected
//     selectedFile: null
//   };

//   // On file select (from the pop up)
//   const onFileChange = event => {
     
//     // Update the state
//     this.setState({ selectedFile: event.target.files[0] });
   
//   };
   
//   // On file upload (click the upload button)
//   const onFileUpload = () => {
   
//     // Create an object of formData
//     const formData = new FormData();
   
//     // Update the formData object
//     formData.append(
//       "myFile",
//       this.state.selectedFile,
//       this.state.selectedFile.name
//     );
   
//     // Details of the uploaded file
//     console.log(this.state.selectedFile);
   
//     // Request made to the backend api
//     // Send formData object
//     axios.post("api/uploadfile", formData);
//   };




//   const fileData = () => {
     
//     if (this.state.selectedFile) {
        
//       return (
//         <div>
//           <h2>File Details:</h2>
//           <p>File Name: {this.state.selectedFile.name}</p>
  
//           <p>File Type: {this.state.selectedFile.type}</p>
  
//           <p>
//             Last Modified:{" "}
//             {this.state.selectedFile.lastModifiedDate.toDateString()}
//           </p>
  
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <br />
//           <h4>Choose before Pressing the Upload button</h4>
//         </div>
//       );
//     }
//   };



//   return (
//     <div>
//         <h1>
//           GeeksforGeeks
//         </h1>
//         <h3>
//           File Upload using React!
//         </h3>
//         <div>
//             <input type="file" onChange={this.onFileChange} />
//             <button onClick={this.onFileUpload}>
//               Upload!
//             </button>
//         </div>
//       {this.fileData()}
//     </div>
//   );

// }

// export default App;

import axios from 'axios';

import React,{Component} from 'react';



class App extends Component {

	state = {

	// Initially, no file is selected
	selectedFile: null,
  checkFile: null
	};
	
	// On file select (from the pop up)
	onFileChange = event => {
	
	// Update the state
	this.setState({ selectedFile: event.target.files[0] });
	
	};
	
	// On file upload (click the upload button)
	onFileUpload = () => {
	
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
	};
	
	// File content to be displayed after
	// file upload is complete
	fileData = () => {
	
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
	};
	
	render() {
	
	return (
		<div>
			<h3>
			File Upload using React!
			</h3>
			<div>
				<input type="file" onChange={this.onFileChange} />
				<button onClick={this.onFileUpload}>
				Upload!
				</button>
			</div>
		{this.fileData()}
		</div>
	);
	}
}

export default App;
