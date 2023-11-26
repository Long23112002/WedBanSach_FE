import { Star, StarFill } from "react-bootstrap-icons";

const renderRating = (diem: number) =>{
    const stars = [];
    for(let i=1; i<=5; i++){
        if(i<=diem){
            stars.push(<StarFill className="text-warning"/>);
        }else{
            stars.push(<Star className="text-secondary"/>);
        }
    }
    return stars;
}

export default renderRating;