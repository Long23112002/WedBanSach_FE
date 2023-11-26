import React, { FormEvent, useState } from 'react';


const SachForm: React.FC = () => {
    const [sach, setSach] = useState({
        maSach: 0,
        tenSach: '',
        giaBan: 0,
        giaNiemYet: 0,
        moTa: '',
        soLuong: 0,
        tenTacGia: '',
        isbn: '',
        trungBinhXepHang: 0,
    })

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        fetch(  'http://localhost:8080/sach',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sach)
            }
        ).then((reponse)=>{
            if(reponse.ok){
                alert("Đã thêm sách thành công!");
                setSach({
                    maSach: 0,
                    tenSach: '',
                    giaBan: 0,
                    giaNiemYet: 0,
                    moTa: '',
                    soLuong: 0,
                    tenTacGia: '',
                    isbn: '',
                    trungBinhXepHang: 0,
                })
            }else{
                alert("Gặp lỗi trong quá trình thêm sách!");
            }
        })
    }

    return (
        <div className='container row d-flex align-items-center justify-content-center'>
            <div className=''>
                <h1>THÊM SÁCH</h1>
                <form onSubmit={handleSubmit} className='form'>
                    <input
                        type='hidden'
                        id='maSach'
                        value={sach.maSach}
                    />

                    <label htmlFor='tenSach'>Tên sách</label>
                    <input
                        className='form-control'
                        type='text'
                        value={sach.tenSach}
                        onChange={(e) => setSach({ ...sach, tenSach: e.target.value })}
                        required
                    />

                    <label htmlFor='giaBan'>Giá bán</label>
                    <input
                        className='form-control'
                        type='number'
                        value={sach.giaBan}
                        onChange={(e) => setSach({ ...sach, giaBan: parseFloat(e.target.value) })}
                        required
                    />

                    <label htmlFor='giaNiemYet'>Giá niêm yết</label>
                    <input
                        className='form-control'
                        type='number'
                        value={sach.giaNiemYet}
                        onChange={(e) => setSach({ ...sach, giaNiemYet: parseFloat(e.target.value) })}
                        required
                    />

                    <label htmlFor='soLuong'>soLuong</label>
                    <input
                        className='form-control'
                        type='number'
                        value={sach.soLuong}
                        onChange={(e) => setSach({ ...sach, soLuong: parseInt(e.target.value) })}
                        required
                    />

                    <label htmlFor='tenSach'>Tên tác giả</label>
                    <input
                        className='form-control'
                        type='text'
                        value={sach.tenTacGia}
                        onChange={(e) => setSach({ ...sach, tenTacGia: e.target.value })}
                        required
                    />

                    <label htmlFor='moTa'>Mô tả</label>
                    <input
                        className='form-control'
                        type='moTa'
                        value={sach.moTa}
                        onChange={(e) => setSach({ ...sach, moTa: e.target.value })}
                        required
                    />

                    <label htmlFor='isbn'>ISBN</label>
                    <input
                        className='form-control'
                        type='isbn'
                        value={sach.isbn}
                        onChange={(e) => setSach({ ...sach, isbn: e.target.value })}
                        required
                    />

                    <button type='submit' className='btn btn-success mt-2'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default SachForm;
