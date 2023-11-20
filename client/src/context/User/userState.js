import React, { useState } from "react";
import userContext from "./userContext";

const UserState = (props) =>{
    const host = process.env.REACT_APP_BACKEND_LOCALHOST;
    const [userData, setUserData] = useState([]);
    const [showUser, setShowUser] = useState([]);
    const getuserinfo = async () => {
      try{
        const response = await fetch(`${host}/api/auth/getuser`, {
          method: 'GET',
          headers: {
            'auth-token' : localStorage.getItem("token")
          },
          })
          const json = await response.json();
          setUserData(json);
      }catch(error){
        console.error('Error fetching user data:', error);
      }
    }

    const changename = async (namer) => {
      try{
    const response = await fetch(`${host}/api/auth/settings/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem("token")
        },
        body: JSON.stringify(namer)
      });
      const updatedUser = await response.json();
      return updatedUser;
    }catch(error){
      console.error('Error fetching user data:', error);
    }
    }

    const changepassword = async (password) => {
    try{
    const response = await fetch(`${host}/api/auth/settings/pw`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem("token")
        },
        body: JSON.stringify(password)
      });
      const updatedUser = await response.json();
      return updatedUser;
    }catch(error){
      console.error('Error fetching user data:', error);
    }
    }
    
    const changeimage = async (url) => {
      try{
      const response = await fetch(`${host}/api/auth/settings/pfp`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token" : localStorage.getItem("token")
          },
          body: JSON.stringify({"image" : url})
        });
        const updatedUser = await response.json();
        return updatedUser;
      }catch(error){
        console.error('Error fetching user data:', error);
      }
    }

    const login = async ({email , password}) => {
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email , password}) 
            });
        const json = await response.json();
        return json;
    }

    const signin = async ({ name, email, password }) => {
        const req = await fetch(`${host}/api/auth/createuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name , email ,password })
            });
        const response = await req.json();
        return response;
    }

    const usershower = async (id) => {
      try{
        const response = await fetch(`${host}/api/auth/showuser/${id}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
          });
          const json = await response.json();
          setShowUser(json);
      }catch(error){
        console.error('Error fetching user data:', error);
      }
    }

    const changegraph = async (graphs) => {
      try{
        const response = await fetch(`${host}/api/auth/incGraphs`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "auth-token" : localStorage.getItem("token")
          },
          body: JSON.stringify({ graphs })
          });
          const json = await response.json();
          setUserData(json.user_upd);
          return json;
      }catch(error){
        console.error('Error fetching user data:', error);
      }
    }

    return (
        <userContext.Provider value={{userData,setUserData,getuserinfo,changename, login, signin, changepassword, changeimage, usershower, showUser, setShowUser, changegraph}}>
            {props.children}
        </userContext.Provider>
        );

};

export default UserState;

