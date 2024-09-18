"use client";

import React, { useState } from 'react';

function ImportButton() {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show confirmation alert
        const isConfirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการอัปโหลดไฟล์?');
        if (!isConfirmed) {
            // Reset the file input and return if the user clicks 'No'
            event.target.value = '';
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const fileContent = reader.result;
                const posts = JSON.parse(fileContent);

                // ส่งข้อมูลไปยัง API
                const response = await fetch("/api/import", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ posts })
                });

                const data = await response.json();

                if (!response.ok) {
                    // ตรวจสอบ data.error และโยนข้อผิดพลาดที่เหมาะสม
                    throw new Error(data.error || 'ไม่สามารถนำเข้าข้อมูลได้');
                }

                alert('นำเข้าข้อมูลสำเร็จ');
                // Reset file input
                event.target.value = '';
            } catch (error) {
                console.error('Import error:', error.message);
                alert('ไม่สามารถนำเข้าข้อมูลได้: ' + error.message);
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            {isUploading && <p>กำลังอัปโหลด...</p>}
        </div>
    );
}

export default ImportButton;
