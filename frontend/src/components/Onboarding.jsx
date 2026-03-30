import React, { useState } from "react";
import api from "../api";
import { setFarmerProfile } from "../store/farmerProfile";
import { t } from "../i18n/translations";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
    { code: "mr", label: "मराठी", sublabel: "Marathi" },
    { code: "hi", label: "हिंदी", sublabel: "Hindi" },
    { code: "en", label: "English", sublabel: "English" },
];

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [lang, setLang] = useState("mr");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        farmerName: "", country: "India", state: "", crop: "",
        soilType: "", irrigation: "", experience: "",
    });

    const handleFormChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const profile = { language: lang, ...form };
        try {
            await api.put("/auth/profile", { farmerProfile: profile });
        } catch {
            // Even if backend fails, save locally so UX isn't blocked
        }
        setFarmerProfile(profile);
        setSaving(false);
        navigate("/");
    };

    const inputCls = "w-full border border-[#dbd8d0] bg-[#f9f8f5] text-sm text-[#1a1a1a] placeholder-[#aaa] px-4 py-2.5 rounded-xl outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10 transition";

    return (
        <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                s === step ? "w-8 bg-[#8b5a2b]" : s < step ? "w-2 bg-[#8b5a2b]/40" : "w-2 bg-[#dbd8d0]"
                            }`}
                        />
                    ))}
                </div>

                <div className="bg-white border border-[#e8e6e0] rounded-2xl shadow-sm p-8">
                    {step === 1 && (
                        <>
                            <h1 className="text-xl font-semibold text-[#1a1a1a] mb-1">
                                {t("welcomeStep1", lang)}
                            </h1>
                            <p className="text-sm text-[#8b8b8b] mb-8">{t("step1Desc", lang)}</p>

                            <div className="flex flex-col gap-3">
                                {LANGUAGES.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => setLang(l.code)}
                                        className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 ${
                                            lang === l.code
                                                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                                                : "border-[#e8e6e0] bg-white text-[#1a1a1a] hover:border-[#1a1a1a]"
                                        }`}
                                    >
                                        <span className="text-lg font-semibold">{l.label}</span>
                                        <span className={`text-xs ${lang === l.code ? "text-white/70" : "text-[#8b8b8b]"}`}>
                                            {l.sublabel}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="mt-8 w-full bg-[#1a1a1a] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#333] transition-colors duration-150"
                            >
                                {t("next", lang)} →
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h1 className="text-xl font-semibold text-[#1a1a1a] mb-1">
                                {t("farmerDetails", lang)}
                            </h1>
                            <p className="text-sm text-[#8b8b8b] mb-6">{t("step2Desc", lang)}</p>

                            <div className="space-y-3">
                                <input name="farmerName" value={form.farmerName} onChange={handleFormChange}
                                    placeholder={t("farmerName", lang)} className={inputCls} />
                                <input name="country" value={form.country} onChange={handleFormChange}
                                    placeholder={t("country", lang)} className={inputCls} required />
                                <input name="state" value={form.state} onChange={handleFormChange}
                                    placeholder={t("state", lang)} className={inputCls} required />
                                <input name="crop" value={form.crop} onChange={handleFormChange}
                                    placeholder={t("crop", lang)} className={inputCls} required />
                                <input name="soilType" value={form.soilType} onChange={handleFormChange}
                                    placeholder={t("soilType", lang)} className={inputCls} />
                                <input name="irrigation" value={form.irrigation} onChange={handleFormChange}
                                    placeholder={t("irrigation", lang)} className={inputCls} />
                                <input name="experience" value={form.experience} onChange={handleFormChange}
                                    placeholder={t("experience", lang)} className={inputCls} />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 border border-[#dbd8d0] text-sm text-[#5a5a5a] py-2.5 rounded-xl hover:bg-[#f5f4f0] transition-colors duration-150"
                                >
                                    ← {t("back", lang)}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !form.state || !form.crop}
                                    className="flex-[2] bg-[#1a1a1a] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                >
                                    {saving ? "…" : t("save", lang)}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* KRUSHIMITRA brand */}
                <p className="text-center text-xs text-[#aaa] mt-6 tracking-widest font-medium">KRUSHIMITRA</p>
            </div>
        </div>
    );
}
