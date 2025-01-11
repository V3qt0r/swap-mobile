import React, {useState} from "react";
import styles from "./Login.module.scss"
// import { useRouter } from "next/router"

type LoginProps = {
    onLogin: (email: string, password: string) => Promise<void>;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] =  useState(false)
    // const router = useRouter();
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true)
        try {
            await onLogin(email, password);
            setLoading(false)
            // router.push("dashboa
        } catch (error) {
            console.error("Login failed: ", error)
            alert("Login failed. Please check your credentials")
            setLoading(false)
            return
        }
    };

    return (
        <div className={styles.background}>
        <div className={styles.loginContainer}>
            <form onSubmit = {handleSubmit} className={styles.loginForm}>
                <h2>Login</h2>
                <div>
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputField}
                     required
                    />
                </div>
                <div>
                    <input 
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.inputField}
                        required
                        />
                </div>
                <button type="submit" className={styles.submitButton}>Login</button>
            </form>
        </div>
        </div>  
    );
};

export default Login;