import React from "react";
import SachModel from "../models/SachModel";
import { my_request } from "./Request";
import { error } from 'console';

interface KetQuaInterface {
    ketQua: SachModel[];
    tongSoTrang: number;
    tongSoSach: number;
}

async function laySach(duongDan: string): Promise<KetQuaInterface> {
    const ketQua: SachModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    // Lấy ra json sach
    const responseData = response._embedded.saches;
    console.log(responseData);

    // lấy thông tin trang
    const tongSoTrang: number = response.page.totalPages;
    const tongSoSach: number = response.page.totalElements;

    for (const key in responseData) {
        ketQua.push({
            maSach: responseData[key].maSach,
            tenSach: responseData[key].tenSach,
            giaBan: responseData[key].giaBan,
            giaNiemYet: responseData[key].giaNiemYet,
            moTa: responseData[key].moTa,
            soLuong: responseData[key].soLuong,
            tenTacGia: responseData[key].tenTacGia,
            trungBinhXepHang: responseData[key].trungBinhXepHang
        });
    }

    return { ketQua: ketQua, tongSoSach: tongSoTrang, tongSoTrang: tongSoTrang };
}

export async function layToanBoSach(trang: number): Promise<KetQuaInterface> {

    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&size=8&page=${trang}`;

    return laySach(duongDan);

}

export async function lay3SachMoiNhat(): Promise<KetQuaInterface> {

    // Xác định endpoint
    const duongDan: string = 'http://localhost:8080/sach?sort=maSach,desc&page=0&size=3';

    return laySach(duongDan);

}


export async function timKiemSach(tuKhoaTimKiem: string, maTheLoai: number): Promise<KetQuaInterface> {

    // Xác định endpoint
    let duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&size=8&page=0`;

    if (tuKhoaTimKiem !== '' && maTheLoai == 0) {
        duongDan = `http://localhost:8080/sach/search/findByTenSachContaining?sort=maSach,desc&size=8&page=0&tenSach=${tuKhoaTimKiem}`
    } else if (tuKhoaTimKiem === '' && maTheLoai > 0) {
        duongDan = `http://localhost:8080/sach/search/findByDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}`
    } else if (tuKhoaTimKiem !== '' && maTheLoai > 0) {
        duongDan = `http://localhost:8080/sach/search/findByTenSachContainingAndDanhSachTheLoai_MaTheLoai?sort=maSach,desc&size=8&page=0&maTheLoai=${maTheLoai}&tenSach=${tuKhoaTimKiem}`
    }

    return laySach(duongDan);

}

export async function laySachTheoMaSach(maSach: number): Promise<SachModel|null> {

    const duongDan = `http://localhost:8080/sach/${maSach}`;

    let ketQua: SachModel;

    try {
        // Gọi phương thức request
        const response =  await fetch(duongDan);

        if(!response.ok){
            throw new Error('Gặp lỗi trong quá trình gọi API lấy sách!')
        }

        const sachData = await response.json();

        if(sachData){
            return {
                maSach: sachData.maSach,
                tenSach: sachData.tenSach,
                giaBan: sachData.giaBan,
                giaNiemYet: sachData.giaNiemYet,
                moTa: sachData.moTa,
                soLuong: sachData.soLuong,
                tenTacGia: sachData.tenTacGia,
                trungBinhXepHang: sachData.trungBinhXepHang
            }
        }else{
            throw new Error('Sách không tồn tài!');
        }
    } catch (error) {
        console.error("Error", error);
        return null;
    }
}
