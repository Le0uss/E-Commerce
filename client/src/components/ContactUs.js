import styled, { keyframes }from "styled-components";
import { useEffect, useState } from "react"
import backgroundImage from '../assets/jess-bailey-q10VITrVYUM-unsplash.jpg';
const ContactUs = () => {
    const [isAnimationComplete, setAnimationComplete] = useState(false);
    useEffect(() => {
        setAnimationComplete(true);
    }, []);
    return(
        <Background>
        <Wrapper>
            <Text>Contact Us!</Text>
        <FormContainer isAnimationComplete={isAnimationComplete}>
            <Form>
                <FormGroup>
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" name="firstName" required />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" required/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="email">E-mail:</label>
                    <input type="email" id="email" name="email" required/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required></textarea>
                </FormGroup>
                <SubmitButton type="submit">Submit</SubmitButton>
            </Form>
        </FormContainer>
        </Wrapper>
        </Background>
    )
}
const slideIn = keyframes`
from{
    transform: translateY(100%);
}
to {
    transform: translateY(0);
}
`
const Background = styled.div`
background: url(${backgroundImage}) center/cover no-repeat;
width: 100%;
height: 100vh;
position: fixed
`
const Wrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-top: 5%;
`
const Text = styled.h1`
font-size: 2.5em;
margin-bottom: 2%;
border-bottom: 2px solid #ccc;
font-weight: normal;
`
const FormContainer = styled.div`
bottom: ${(props) => (props.isAnimationComplete ? "0" : "-100%")};
width: 50%;
background-color: white;
padding: 40px;
box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
animation: ${slideIn} 0.5s ease-out forwards;
`
const Form = styled.form`
display: flex;
flex-direction: column;
gap: 15px;
`
const FormGroup = styled.div`
display: flex;
flex-direction: column;
    label {
    margin-bottom: 5px;
    }
    input,
    textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    }
`
const SubmitButton = styled.button`
background-color: #008060;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover{
        background-color: deepskyblue;
        color: floralwhite;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`
export default ContactUs;

