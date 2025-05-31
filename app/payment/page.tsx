'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '../style.css'; // 保持样式一致

// 定义挂号信息类型
type RegistrationInfo = {
  department: string | null;
  doctorName: string;
  registrationTime: string;
};

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'wechat' | 'alipay' | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // 从localStorage获取挂号信息
  useEffect(() => {
    const registrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    const latestRegistration = registrations[registrations.length - 1];
    
    if (latestRegistration) {
      setRegistrationInfo(latestRegistration);
    } else {
      // 如果没有挂号信息，返回挂号页面
      router.push('/registration');
    }
  }, [router]);

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('请选择支付方式');
      return;
    }

    setIsPaying(true);
    
    // 模拟支付处理
    setTimeout(() => {
      setIsPaying(false);
      
      // 更新挂号状态为已支付
      const registrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
      if (registrations.length > 0) {
        registrations[registrations.length - 1].paymentStatus = 'paid';
        registrations[registrations.length - 1].paymentMethod = selectedPayment;
        registrations[registrations.length - 1].paymentTime = new Date().toLocaleString();
        localStorage.setItem('userRegistrations', JSON.stringify(registrations));
      }
      
      // 跳转到支付成功页面
      alert('支付成功');
      router.push('/');
    }, 1500);
  };

  if (!registrationInfo) {
    return (
      <div className="payment-container">
        <div className="loading">加载挂号信息中...</div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <header>
        <h1>支付挂号费</h1>
        <button className="return-btn" onClick={() => router.back()}>返回</button>
      </header>

      <div className="order-info">
        <h2>订单信息</h2>
        <p>科室: {registrationInfo.department || '未指定'}</p>
        <p>医生: {registrationInfo.doctorName}</p>
        <p>挂号时间: {registrationInfo.registrationTime}</p>
        <p className="price">金额: ¥300.00</p>
      </div>

      <h2>选择支付方式</h2>

      <div 
        className={`payment-method ${selectedPayment === 'wechat' ? 'selected' : ''}`}
        onClick={() => setSelectedPayment('wechat')}
      >
        <img 
          src="/images/wechat-pay.jpg" 
          alt="微信支付" 
          className="payment-icon" 
        />
        <div>
          <h3>微信支付</h3>
          <p>推荐微信用户使用</p>
        </div>
      </div>

      <div 
        className={`payment-method ${selectedPayment === 'alipay' ? 'selected' : ''}`}
        onClick={() => setSelectedPayment('alipay')}
      >
        <img 
          src="/images/alipay.jpg" 
          alt="支付宝" 
          className="payment-icon" 
        />
        <div>
          <h3>支付宝</h3>
          <p>推荐支付宝用户使用</p>
        </div>
      </div>

      <button 
        className={`pay-btn ${isPaying ? 'loading' : ''}`}
        onClick={handlePayment}
        disabled={isPaying}
      >
        {isPaying ? '支付处理中...' : '立即支付'}
      </button>

      <style jsx>{`
        .payment-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Microsoft YaHei', sans-serif;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .return-btn {
          background: none;
          border: 1px solid #ddd;
          padding: 5px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .order-info {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .payment-method {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s;
        }
        .payment-method:hover {
          background-color: #f5f5f5;
        }
        .payment-method.selected {
          border-color: #1890ff;
          background-color: #e6f7ff;
        }
        .payment-icon {
          width: 40px;
          height: 40px;
          margin-right: 15px;
        }
        .price {
          color: #f5222d;
          font-weight: bold;
          font-size: 18px;
        }
        .pay-btn {
          width: 100%;
          background-color: #1890ff;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          transition: background-color 0.3s;
        }
        .pay-btn:hover {
          background-color: #40a9ff;
        }
        .pay-btn.loading {
          background-color: #8c8c8c;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;