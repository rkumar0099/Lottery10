import React, {useState} from 'react';
import './slider.css';
import '../../style/global.css';


const Slider = (props) => {
    const values = props.list;
    console.log('Slider list ', values);
    const [slideIndex, setSlideIndex] = useState(1);

    const nextSlide = () => {
        if(slideIndex !== values.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === values.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(values.length)
        }
    }

    const handleClick = (round) => {
        console.log('Performing draw/redeem for round ', round);
        props.handler(round);
    }
        
    return (
        <div>
            {
                values.map((value, index) => {
                    console.log(value, index);
                    return (
                        <div
                        className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                        >
                        <button className="perform-draw"
                        onClick={() => handleClick(value)}>Round {value} {props.type}</button>
                        </div>
                    )
                })
        } 
        <button className="arrow right" onClick={nextSlide}></button>
        <button className="arrow left" onClick={prevSlide}></button>
        </div>
    )
}

export default Slider;