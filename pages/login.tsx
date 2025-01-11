import Login from "@/components/Login";
import React from "react";
import { useRouter } from "next/router"

const LoginPage: React.FC = () => {
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const router = useRouter()

    const handleLogin = async(email: string, password: string) => {

        try{
            const response = await 
                fetch(`${baseUrl}/user/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({email, password}),
                });
                
            if (!response.ok) {
                throw new Error("Invalid login credentials")
            }

            const data = await response.json()
            console.log("Login successful:", data)

            //Save bearer token in LocalStorage
            const token = data.token
            if(token) {
                localStorage.setItem("token", token);
                alert("Login successful! Token saved");
                router.push("dashboard")
            } else {
                throw new Error("Token not found in response")
            }
        } catch (error) {
            console.error("Error during login", error);
            alert("Login failed. Please try again")
            return
        }
    };

    return (
        <div>
            <Login onLogin={handleLogin}/>
        </div>
    );
};

export default LoginPage