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
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { redirect } from "react-router-dom";
import { ProgressBar } from 'react-bootstrap';
import {withRouter} from './withRouter';
import * as ReactBootStrap from 'react-bootstrap';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

class App extends Component {

	state = {

	// Initially, no file is selected
	selectedFile: null,
    checkFile: null,
    percentage: 0,
    loading: true,
	pdf1Name: "",
	pdf1Score: 0,
	pdf1Link: "",
	pdf2Name: "",
	pdf2Score: 0,
	pdf2Link: ""
	};
	
	// On file select (from the pop up)
	onFileChange = event => {
	
	// Update the state
	this.setState({ selectedFile: event.target.files[0] });
	
	};
	
	// On file upload (click the upload button)
	onFileUpload = () => {
		this.setState({loading:false})
	
	// Create an object of formData
	const formData = new FormData();
	
	// Update the formData object
	formData.append('File',this.state.selectedFile);
  console.log(Object.fromEntries(formData.entries()))
	
	// Details of the uploaded file
	//console.log(this.state.selectedFile);
	
	// Request made to the backend api
	// Send formData object

	const options = {
		onUploadProgress: (progressEvent) => {
			const {loaded,total} = progressEvent;
			let percent = Math.floor(loaded*100/total)
			console.log(`${loaded} kb of ${total} kb | ${percent}% `);
		
		if(percent < 100) {
		this.setState({percentage: percent})
		}
	}
	}
	
	axios.post("api/uploadfile", formData,options, {responseType: 'arraybuffer'}).then(res => 
    {
		
    //   const file = new Blob(
    //     [res.data], 
    //     {type: 'application/pdf'});
		console.log(res.data)
		this.setState({pdf1Link:res.data.pdf1Link})
		this.setState({pdf2Link:res.data.pdf2Link})
		this.setState({pdf2Name:res.data.pdf2Name})
		this.setState({pdf1Name:res.data.pdf1Name})
		this.setState({pdf2Score:res.data.pdf2Score})
		this.setState({pdf1Score:res.data.pdf1Score})
		this.setState({percentage: 100})
		this.setState({loading:true})

		return ( 
			<div>
				<h4>"pdf1"</h4>
		<ProgressBar now={60} label={`${60}%`} />
			</div>
			);
        //console.log(res.data);
  //Build a URL from the file
        //console.log(res.data)
    //   const fileURL = URL.createObjectURL(file);
  //Open the URL on new Window
    //   window.open(fileURL);
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

	 logout = () => {
	//	let navigate = useNavigate();
		// const handleLogout = () => {
			console.log("logout");
		//	sessionStorage.removeItem('Auth Token');
			//this.props.navigate('/login')
			<Navigate to="/login" replace={true} />
	 };
		//  }
	// 	// 
	// 	// useEffect(() => {
	// 	// 	let authToken = sessionStorage.getItem('Auth Token')
	// 	// 	console.log(authToken)
	// 	// 	if (authToken) {
	// 	// 		navigate('/home')
	// 	// 	}
	
	// 	// 	if (!authToken) {
	// 	// 		navigate('/login')
	// 	// 	}
	// 	// }, [])

	// }
	
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
			<h4>Choose file before Pressing the Upload button</h4>
			
		</div>
		);
	}
	};
	
	// state = {
	// 	navigate: false
	// 	};
	// 	logout = () => {
	// 	localStorage.clear("token");
	// 	sessionStorage.removeItem('Auth Token');
	// 	//this.setState({ navigate: true });
	// 	// return <redirect to="/" push={true} />;
	// 	return <redirect to="/" push={true} />;
	// 	};
	// 	render () {
	// 	const { navigate } = this.state;
	// 	if (navigate) {
	// 	return <redirect to="/" push={true} />;
	// 	}
	// 	return <button onClick={this.logout}>Log out</button>;
	// 	}
	
	
	render() {
		
	const {percentage} = this.state;
	return (
		<div>
			<h3>
			Document Retreival Engine!
			</h3>
	
			<div>
				<input type="file" onChange={this.onFileChange} />
				<button onClick={this.onFileUpload}>
				Upload!
				</button>
				{percentage>0 && <ProgressBar now={percentage} active label={`${percentage}%`} />}
				{this.state.loading? <></>:<ReactBootStrap.Spinner animation="border" />}
			</div>
			<div>
		{this.fileData()}
		
		
		<h2>
		{/* {this.state.pdf1Link}<br/>
		{this.state.pdf1Name}<br/>
		{this.state.pdf1Score}<br/>
		{this.state.pdf2Link}<br/>
		{this.state.pdf2Score}<br/>
		{this.state.pdf2Name} */}
		<p><a href={this.state.pdf1Link}>{this.state.pdf1Name}</a></p>
		<LinearProgressWithLabel value={80} />
		<p><a href={this.state.pdf2Link}>{this.state.pdf2Name}</a></p>
		<LinearProgressWithLabel value={60} />
		{/* <Text
            style={styles.hyperlinkStyle}
            onPress={() => {
              Linking.openURL('https://techup.co.in');
            }}>
            Techup.co.in
          </Text> */}
		</h2>
		 {/* <button onClick={this.logout}>Log out</button> */}
		 <button onClick={this.logout()}>Log out</button>
		</div>
		</div>
	);
	}
}


export default App;
