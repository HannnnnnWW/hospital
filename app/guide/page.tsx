'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './GuidePage.module.css';

const GuidePage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [patientAge, setPatientAge] = useState<number | null>(null);
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [recommendDept, setRecommendDept] = useState<string | null>(null);
    const [hoveredPart, setHoveredPart] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    // 人体部位与症状映射
    const bodyParts = {
        '头部': ['头痛', '头晕', '外伤', '发热', '失眠'],
        '胸部': ['胸痛', '胸闷', '心悸', '乳房肿块', '咳嗽'],
        '腹部': ['腹痛', '腹泻', '恶心呕吐', '便秘', '腹胀'],
        '生殖系统': ['月经不调', '下腹痛', '阴道出血', '早孕检查', '性传播疾病']
    };

    // 部位坐标和样式
    const partCoordinates = {
        '头部': { top: '8%', left: '50%', width: '18%', height: '13%', shape: 'circle' },
        '胸部': { top: '21%', left: '50%', width: '25%', height: '13%', shape: 'rect' },
        '腹部': { top: '34%', left: '50%', width: '22%', height: '15%', shape: 'rect' },
        '生殖系统': { top: '49%', left: '50%', width: '18%', height: '4%', shape: 'rect' }
    };

    // 科室推荐规则
    const departmentRules: Record<string, string> = {
        '头痛': '内科', '头晕': '内科', '发热': '内科', '胸闷': '内科', '心悸': '内科',
        '腹泻': '内科', '恶心呕吐': '内科', '便秘': '内科', '咳嗽': '内科', '失眠': '内科',
        '外伤': '外科', '乳房肿块': '外科', '腹痛': '外科', '腹胀': '外科', '胸痛': '外科',
        '月经不调': '妇产科', '下腹痛': '妇产科', '阴道出血': '妇产科', '早孕检查': '妇产科',
        '性传播疾病': '妇产科'
    };

    // 步骤1：输入年龄
    const handleAgeNext = () => {
        const ageInput = document.getElementById('ageInput') as HTMLInputElement;
        const age = parseInt(ageInput.value);

        if (isNaN(age) || age < 0 || age > 120) {
            alert("请输入有效的年龄（0-120岁）");
            return;
        }

        setPatientAge(age);

        // 儿童直接推荐儿科
        if (age < 14) {
            setRecommendDept('儿科');
            setCurrentStep(4);
        } else {
            setCurrentStep(2);
        }
    };

    // 步骤2：选择身体部位
    const handlePartSelect = (part: string) => {
        setSelectedPart(part);

        if (part === '生殖系统') {
            
            setCurrentStep(3);
        } else {
            setCurrentStep(3);
        }
    };

    // 步骤3：选择具体症状
    const handleSymptomSelect = (symptom: string) => {
        const dept = departmentRules[symptom] || '内科';
        setRecommendDept(dept);
        setCurrentStep(4);
    };
    useEffect(() => {
        const checkLoginStatus = () => {
            // 示例：从localStorage检查token
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token);
        };
        checkLoginStatus();
    }, []);
    // 处理挂号跳转
    const handleAppointmentRedirect = () => {
        if (isLoggedIn === null) return; // 等待登录状态检查

        if (isLoggedIn) {
            // 已登录，跳转到挂号页
            router.push(`/appointment?dept=${encodeURIComponent(recommendDept || '')}`);
        } else {
            // 未登录，跳转到登录页，并携带返回URL
            router.push(`/login?redirect=${encodeURIComponent(`/appointment?dept=${encodeURIComponent(recommendDept || '')}`)}`);
        }
    };
    // 重新开始
    const restartGuide = () => {
        setCurrentStep(1);
        setPatientAge(null);
        setSelectedPart(null);
        setSelectedSymptoms([]);
        setRecommendDept(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className="text-2xl font-bold">智能症状分诊系统</h1>
                    <Link href="/" className="bg-white/10 hover:bg-white/20 text-sm px-6 py-2 rounded-full transition-all">
                        返回首页
                    </Link>
                </div>
            </header>

            <main className={styles.main}>
                {/* 步骤指示器 */}
                <div className={styles.steps}>
                    {[1, 2, 3, 4].map(step => (
                        <div
                            key={step}
                            className={`${styles.step} ${currentStep >= step ? styles.stepActive : styles.stepInactive
                                }`}
                        >
                            {step}
                        </div>
                    ))}
                </div>

                {/* 步骤1：年龄输入 */}
                {currentStep === 1 && (
                    <div className={styles.card}>
                        <h2 className="text-2xl text-[#0072c6] mb-6 font-semibold">
                            请先输入患者年龄
                        </h2>
                        <input
                            type="number"
                            id="ageInput"
                            className={styles.input}
                            min="0"
                            max="120"
                            placeholder="请输入周岁年龄"
                        />
                        <p className="mt-4 text-gray-500 text-sm">（14岁以下儿童将直接推荐儿科）</p>
                        <button
                            className={`${styles.button} ${styles.buttonPrimary} mt-8`}
                            onClick={handleAgeNext}
                        >
                            下一步
                        </button>
                    </div>
                )}

                {/* 步骤2：人体图选择（仅成人显示） */}
                {currentStep === 2 && patientAge && patientAge >= 14 && (
                    <div className={styles.card}>
                        <h2 className="text-2xl text-[#0072c6] mb-8 text-center font-semibold">
                            请点击不适部位
                        </h2>

                        <div className={styles.bodyContainer}>
                            {/* 人体示意图 */}
                            <img
                                src="/human-body.jpg!con"
                                alt="人体示意图"
                                className={styles.bodyImage}
                                useMap="#bodyMap"
                            />

                            {/* 可点击热区 */}
                            <div className="absolute inset-0">
                                {Object.entries(partCoordinates).map(([part, coord]) => (
                                    <div
                                        key={part}
                                        className={`${styles.hotspot} ${coord.shape === 'circle' ? styles.hotspotCircle : ''
                                            }`}
                                        style={{
                                            top: coord.top,
                                            left: coord.left,
                                            width: coord.width,
                                            height: coord.height,
                                            transform: 'translate(-50%, 0)'
                                        }}
                                        onClick={() => handlePartSelect(part)}
                                        onMouseEnter={() => setHoveredPart(part)}
                                        onMouseLeave={() => setHoveredPart(null)}
                                    >
                                        {hoveredPart === part && (
                                            <div className={styles.hotspotLabel}>
                                                {part}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 步骤3：症状选择 */}
                {currentStep === 3 && selectedPart && (
                    <div className={styles.card}>
                        <h2 className="text-2xl text-[#0072c6] mb-8 text-center font-semibold">
                            请选择{selectedPart}的具体症状
                        </h2>
                        <div className={styles.symptomsGrid}>
                            {bodyParts[selectedPart].map((symptom) => (
                                <button
                                    key={symptom}
                                    onClick={() => handleSymptomSelect(symptom)}
                                    className={styles.symptomItem}
                                >
                                    <span className={styles.symptomDot}></span>
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 步骤4：推荐结果 */}
                {currentStep === 4 && recommendDept && (
                    <div className={styles.card}>
                        <h2 className={styles.resultTitle}>
                            推荐就诊科室
                        </h2>

                        {patientAge && patientAge < 14 && (
                            <div className={styles.childrenNotice}>
                                <p>根据儿童年龄（{patientAge}岁）直接推荐儿科就诊</p>
                            </div>
                        )}

                        <div className={styles.resultContent}>
                            {recommendDept}
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={restartGuide}
                                className={`${styles.button} ${styles.buttonSecondary}`}
                            >
                                重新分诊
                            </button>
                            <button
                                onClick={handleAppointmentRedirect}
                                className={`${styles.button} ${styles.buttonTertiary}`}
                                disabled={isLoggedIn === null}
                            >
                                {isLoggedIn === null ? '检查登录中...' : '立即挂号'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GuidePage;