import React from "react";
import { my_request } from "./Request";
import DanhGiaModel from "../models/DanhGiaModel";
import HinHAnhModel from "../models/HinhAnhModel";


async function layDanhGiaCuaMotSach(duongDan: string): Promise<DanhGiaModel[]> {
    const ketQua: DanhGiaModel[] = [];

    const response = await my_request(duongDan);

    
    const responseData = response._embedded.suDanhGias;
    // console.log(responseData);

    for (const key in responseData) {
        ketQua.push({
            maDanhGia: responseData[key].maDanhGia,
            diemXepHang: responseData[key].diemXepHang,
            nhanXet: responseData[key].nhanXet,
        });
    }

    return ketQua;
}

async function layAnhCuaMotSach(duongDan: string): Promise<HinHAnhModel[]> {
    const ketQua: HinHAnhModel[] = [];

    
    const response = await my_request(duongDan);

    
    const responseData = response._embedded.hinhAnhs;
    // console.log(responseData);

    for (const key in responseData) {
        ketQua.push({
            maHinhAnh: responseData[key].maHinhAnh,
            tenHinhAnh: responseData[key].tenHinhAnh,
            laIcon: responseData[key].laIcon,
            duongDan: responseData[key].duongDan,
            duLieuAnh: responseData[key].duLieuAnh,
        });
    }

    return ketQua;
}

export async function layToanBoAnhCuaMotSach(maSach: number): Promise<HinHAnhModel[]> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh`;
 
    return layAnhCuaMotSach(duongDan);
 }

 export async function lay1AnhCuaMotSach(maSach: number): Promise<HinHAnhModel[]> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0&size=1`;

    return layAnhCuaMotSach(duongDan);
}


export async function layToanBoDanhGiaCuaMotSach(maSach: number): Promise<DanhGiaModel[]> {
   // Xác định endpoint
   const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachSuDanhGia`;

   return layDanhGiaCuaMotSach(duongDan);
}


export async function lay1DanhGiaCuaMotSach(maSach: number): Promise<DanhGiaModel[]> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachSuDanhGia?sort=maDanhGia,asc&page=0&size=1`;
 
    return layDanhGiaCuaMotSach(duongDan);
 }