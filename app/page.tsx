'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';

type Department = {
    id: number;
    name: string;
};

type Article = {
    id: number;
    title: string;
    content: string;
};

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const router = useRouter();

    useEffect(() => {
        // 检查登录状态
        const checkLoginStatus = () => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            setIsLoggedIn(loginStatus === 'true');
        };
        
         // 获取管理员状态
            const adminStatus = localStorage.getItem('isAdmin');
            setIsAdmin(adminStatus === 'true');

        checkLoginStatus();
    /*// 新增auth.ts工具模块
export const checkAuth = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/check`, {
      credentials: 'include'
    });
    return res.ok;
  } catch (err) {
    return false;
  }
};

// 修改登录状态检查
useEffect(() => {
  const verifyAuth = async () => {
    const authenticated = await checkAuth();
    setIsLoggedIn(authenticated);
  };
  verifyAuth();
}, []);*/    

        // 获取科室数据（预留API接口），目前为了模拟是静态不可改变的
        const fetchDepartments = async () => {
            try {
                // 这里将来会替换为实际的API调用
                // const response = await fetch('/api/departments');
                // const data = await response.json();
                // setDepartments(data);
                
                // 临时使用模拟数据
                const mockDepartments = [
                    { id: 1, name: '内科门诊' },
                    { id: 2, name: '外科门诊' },
                    { id: 3, name: '儿科门诊' },
                    { id: 4, name: '妇产科门诊' },
                    { id: 5, name: '急诊科' }
                ];
                setDepartments(mockDepartments);
            } catch (error) {
                console.error('获取科室数据失败:', error);
            }
        };
/*// 修改后的fetchDepartments（科室数据接口）
const fetchDepartments = async () => {
  try {
    const res = await fetch(`${API_BASE}/departments`);
    if (!res.ok) throw new Error(res.statusText);
    
    const data: Department[] = await res.json();
    // 类型校验
    if (!Array.isArray(data) || !data.every(dept => dept.id && dept.name)) {
      throw new Error('接口返回数据格式错误');
    }
    setDepartments(data);
  } catch (err) {
    // 统一错误处理
    handleError(err);
  }
};*/
/*// 增强Article类型
type Article = {
  id: number;
  title: string;
  summary: string; // 新增摘要字段
  publish_date: string;
  view_count: number;
  is_top: boolean; // 置顶标识
};

// 请求逻辑优化
const fetchArticles = async () => {
  try {
    const [articlesRes, bannersRes] = await Promise.all([
      fetch(`${API_BASE}/articles?limit=5`),
      fetch(`${API_BASE}/banners`)
    ]);
    
    const articlesData = await validateResponse<Article[]>(articlesRes);
    const bannersData = await validateResponse<Banner[]>(bannersRes);
    
    setArticles([...bannersData, ...articlesData]);
  } catch (err) {
    handleError(err);
  }
};*/
        // 获取公告数据（预留API接口）
        const fetchArticles = async () => {
            try {
                // 这里将来会替换为实际的API调用
                // const response = await fetch('/api/articles');
                // const data = await response.json();
                // setArticles(data);
                
                // 临时使用模拟数据
                const mockArticles = [
                    { id: 1, title: '【最新】五一假期门诊安排通知', content: '五一期间门诊正常开放...' },
                    { id: 2, title: '新引进 CT 设备正式投入使用', content: '我院最新引进的256层螺旋CT...' }
                ];
                setArticles(mockArticles);
            } catch (error) {
                console.error('获取公告数据失败:', error);
            }
        };

        fetchDepartments();
        fetchArticles();
    }, []);

    const navigateToDepartment = (deptName: string) => {
        if (!isLoggedIn) {
            alert('请先登录后再进行挂号');
            return;
        }
        router.push(`/department?department=${encodeURIComponent(deptName)}`);
    };

    return (
        <div>
            <header>
                <h1>奔向端午医院预约挂号系统</h1>
         {isLoggedIn ? (
             isAdmin ? (
                  <Link href="/admin" className="login-btn">管理页</Link>
                 ) : (
                  <Link href="/profile" className="login-btn">个人中心</Link>
                 )
            ) : (
                  <Link href="/login" className="login-btn">用户登录</Link>
            )}
            </header>
            <div className="hospital-image">
            <img src="/hospital-image.png" alt="医院实景图" />
            </div>
            <div className="guide-section">
                <Link href="/guide" className="guide-dialog">智能导诊入口 ▶</Link>
            </div>
            <div className="main-content">
                <div className="registration-section">
                    <h2>门诊挂号</h2>
                    <ul>
                        {departments.map((dept) => (
                            <li key={dept.id} onClick={() => navigateToDepartment(dept.name)}>
                                {dept.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="notice-section">
                    <h2>医院公告</h2>
                    <ul>
                        {articles.map((article) => (
                            <li key={article.id}>
                                <Link href={`/article?id=${article.id}`}>
                                    {article.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HomePage;