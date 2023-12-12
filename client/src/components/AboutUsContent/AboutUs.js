import styled, {keyframes} from "styled-components";
import { useEffect, useState } from "react"
import AboutUsText from "../AboutUsContent/AboutUsText";



const AboutUs = () => {
    const [isAnimationComplete, setAnimationComplete] = useState(false);
    useEffect(() => {
        setAnimationComplete(true);
    }, []);
    return(
        <>
        <Wrapper isAnimationComplete={isAnimationComplete}>
            <LeftGrid>
            <AboutUsText/>
            </LeftGrid>
            <RightGrid>
                <Image src='\priscilla-du-preez-XkKCui44iM0-unsplash.jpg' alt="About Us Image" />
            </RightGrid>
        </Wrapper>
        </>        
    )
}
const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to{
        opacity: 1;
        transform: translateX(0);
    }
`

const Wrapper = styled.div`
display:grid;
grid-template-columns: 1fr 1fr;
gap:20px;
opacity: ${(props) => (props.isAnimationComplete ? 1 : 0)};
animation: ${slideIn} 1s ease-out forwards;
`;
const LeftGrid = styled.div`
grid-area: 1 / 1 / 2 / 2;
margin-top: 50px;
margin-left: 30px;
display: flex;
justify-content: center;
align-items: center;
`
const RightGrid = styled.div`
grid-area: 1 / 2 / 2 / 3;
margin-top: 50px;
margin-right: 30px;
`
const Image = styled.img`
width: 100%;
height: 100%;
border-radius: 50px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
`
export default AboutUs
