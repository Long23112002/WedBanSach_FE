class SachModel {
    maSach: number;
    tenSach?: string; 
    giaBan?: number;
    giaNiemYet?: number;
    moTa?:string;
    soLuong?: number;
    tenTacGia?:string;
    trungBinhXepHang?:number;
    images?: string[]

    constructor(
        maSach: number,
        tenSach?: string,
        giaBan?: number,
        giaNiemYet?: number,
        moTa?:string,
        soLuong?: number,
        tenTacGia?:string,
        trungBinhXepHang?:number,
        images?: string[]
    ){
        this.maSach= maSach;
        this.tenSach= tenSach;
        this.giaBan= giaBan;
        this.giaNiemYet= giaNiemYet;
        this.moTa= moTa;
        this.soLuong= soLuong;
        this.tenTacGia= tenTacGia;
        this.trungBinhXepHang= trungBinhXepHang;
        this.images= images;
    }
}

export default SachModel;