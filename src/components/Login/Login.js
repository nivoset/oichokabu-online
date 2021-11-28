import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginUser, userSelector } from '../../store/userSlice.js';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
import './Login.scss';

export default function Login() {
	
	let history = useHistory();
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const { isFetching, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	
	const submitData = (data) => {
		dispatch(loginUser(data))
	};
	
	useEffect(() => {
		if (isSuccessful) {
			history.push("/");
		}
		if (isError) {
			
		}
	}, [isSuccessful, isError])
	
	return (
		<>
			<Navbar />
			<div>
				<main>
					<h2 className="login-heading">Log In</h2>
					<div className="form-container">
						<div className="login-form">
							<form onSubmit={handleSubmit(submitData)}>
									<input {...register("username", { required: true })} placeholder="Username" />
									<input {...register("password", { required: true })} placeholder="Password" />
									<button type="submit">Submit</button>
							</form>
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	)
}