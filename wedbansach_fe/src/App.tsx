import React, { useState } from 'react';
import './App.css';
import Navbar from './layouts/header-footer/Navbar';
import Footer from './layouts/header-footer/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './layouts/about/About';
import ChiTietSanPham from './layouts/product/ChiTietSanPham';
import HomePage from './layouts/home-page/HomePage';
import DangKyNguoiDung from './layouts/user/DangKiNguoiDung';
import KichHoatTaiKhoan from './layouts/user/KichHoatTaiKhoan';
import DangNhap from './layouts/user/DangNhap';
import SachForm from './layouts/product/components/SachForm';
import Test from './layouts/user/Test';
import Cart from './layouts/cart/Cart';
import HoSoCaNhan from './layouts/user/HoSoCaNhan';

function App() {
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar tuKhoaTimKiem={tuKhoaTimKiem}  setTuKhoaTimKiem={setTuKhoaTimKiem}/>
        <Routes>
             <Route index={true} path='/WedBanSach_FE' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
             <Route path='/WedBanSach_FE/:maTheLoai' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
             <Route path='/WedBanSach_FE/about' element={<About />} />
             <Route path='/WedBanSach_FE/sach/:maSach' element={<ChiTietSanPham />} />
             <Route path='/WedBanSach_FE/dang-ky' element={<DangKyNguoiDung />} />
             <Route path='/WedBanSach_FE/kich-hoat/:email/:maKichHoat' element={<KichHoatTaiKhoan/>} />
             <Route path='/WedBanSach_FE/dang-nhap' element={<DangNhap />} />
             <Route path='/WedBanSach_FE/test' element={<Test />} />
             <Route path='/WedBanSach_FE/admin/them-sach' element={<SachForm />} />
             <Route path='/WedBanSach_FE/cart' element = {<Cart/>} />
             <Route path='/WedBanSach_FE/ho-so-ca-nhan' element={<HoSoCaNhan/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;