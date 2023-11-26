import React from "react";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import DanhSachSanPham from "../product/DanhSachSanPham";
import { useParams } from "react-router-dom";

interface HomePageProps{
   tuKhoaTimKiem: string
}

function HomePage({tuKhoaTimKiem}: HomePageProps){

    const {maTheLoai} = useParams();
    let maTheLoaiNumber = 0;

    try {
        maTheLoaiNumber = parseInt(maTheLoai+'');
    } catch (error) {
        maTheLoaiNumber = 0;
        console.error('Error: ', error);
    }
    if(Number.isNaN(maTheLoaiNumber))
        maTheLoaiNumber = 0;

    return(
        <div>
            <Banner />
            <Carousel />
            <DanhSachSanPham tuKhoaTimKiem={tuKhoaTimKiem} maTheLoai={maTheLoaiNumber}/>
        </div>
    );
}

export default HomePage;