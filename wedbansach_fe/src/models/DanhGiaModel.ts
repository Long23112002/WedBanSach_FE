class DanhGiaModel {
    maDanhGia: number;
    diemXepHang: number;
    nhanXet: string;

    constructor(
        maDanhGia: number,
        diemXepHang: number,
        nhanXet: string,
    ) {
        this.maDanhGia = maDanhGia;
        this.diemXepHang = diemXepHang;
        this.nhanXet = nhanXet;
    }
}

export default DanhGiaModel;