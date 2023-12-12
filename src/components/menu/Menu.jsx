import React from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'

export default function Menu() {
    const navigate = useNavigate();
  return (
    <div>
      <h2 className='my-5'>Xin chào tôi cho thể giúp gì cho bạn</h2>
      <div class="d-flex justify-content-evenly">
        <button type='button' className='btn btn-primary' onClick={()=>navigate("/SubHome")}>Tư vấn không tương tác</button>
        <button type='button' className='btn btn-secondary' onClick={()=>navigate("/Home")}>Tư vấn có tương tác</button>
      </div>
    </div>
  )
}
