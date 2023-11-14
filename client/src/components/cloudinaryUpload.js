import React, { useContext, useEffect } from "react";
import contextValue from "../context/User/userContext.js";

const CloudinaryUploadWidget = ( props ) => {
  const { handleUploadSuccess } = props
  const cloudName = "defrwqxv6";
  const uploadPreset = "dfr2meo6";

  const context = useContext(contextValue);
  const { changeimage, setUserData } = context;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
    return;
    }
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          handlePfpUpdate(result.info.secure_url);
        }
      }
    );  

    const handleClick = () => {
      myWidget.open();
    };

    const handlePfpUpdate =async (url) => {
      try {
        const updatedUser = await changeimage(url); 
        
        if(!updatedUser.success){
          alert(updatedUser.error);
        }
        else{
          setUserData((prevUserData) => ({
            ...prevUserData,
            image: url
          }));
        }
      } catch (error) {
        console.error('Error updating name:', error);
      }
    };

    const uploadButton = document.getElementById("upload_widget");
  if (uploadButton) {
    uploadButton.addEventListener("click", handleClick);
  }

  // Cleanup function
  return () => {
    if (uploadButton) {
      uploadButton.removeEventListener("click", handleClick);
    }
  };
}, [handleUploadSuccess, changeimage, setUserData]);

  return (
    <button id="upload_widget" 
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Change
                      </button>
   
  );
};

export default CloudinaryUploadWidget;