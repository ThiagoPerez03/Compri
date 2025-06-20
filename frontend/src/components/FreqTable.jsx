import React, { useState } from "react";
import './FreqTable.css';
import { Card, Button, Modal } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
    </svg>
);

const FreqTable = ({ data: algorithmDetails }) => {
    const [showModal, setShowModal] = useState(false);

    if (!algorithmDetails || !algorithmDetails.tabla_codigos) {
        return <p>Cargando datos...</p>;
    }

    const MAX_LABELS_PREVIEW = 15;
    const isDataTruncated = algorithmDetails.tabla_codigos.length > MAX_LABELS_PREVIEW;
    
    const chartDatasetOptions = {
        label: 'Frecuencia',
        backgroundColor: 'rgba(43, 54, 116, 0.8)',
        borderRadius: 5,
        borderSkipped: false,
    };

    const previewData = {
        labels: algorithmDetails.tabla_codigos.slice(0, MAX_LABELS_PREVIEW).map(e => e.caracter),
        datasets: [{
            ...chartDatasetOptions,
            data: algorithmDetails.tabla_codigos.slice(0, MAX_LABELS_PREVIEW).map(e => e.frecuencia),
        }]
    };

    const fullData = {
        labels: algorithmDetails.tabla_codigos.map(e => e.caracter),
        datasets: [{ 
            ...chartDatasetOptions,
            data: algorithmDetails.tabla_codigos.map(e => e.frecuencia) 
        }]
    };

    const previewOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: { font: { size: 10, weight: 'bold' }, color: 'rgba(43, 54, 116, 1)', maxRotation: 0, minRotation: 0 },
                grid: { display: false }
            },
            y: { display: false }
        }
    };

    const modalOptions = {
        ...previewOptions,
        scales: {
            x: {
                ticks: { font: { size: 12, weight: 'bold' }, color: 'rgba(43, 54, 116, 1)', maxRotation: 0, minRotation: 0 },
                grid: { display: false }
            },
            y: {
                display: true,
                grid: { color: '#e0e0e0' },
                ticks: { color: 'rgba(43, 54, 116, 1)', font: { size: 12 } }
            }
        }
    };

    const largeChartWidth = Math.max(900, fullData.labels.length * 40);

    return (
        <>
            <Card className="chart-card">
                <Card.Header className="chart-header">
                    <h5 className="chart-title">Frecuencia</h5>
                    <Button variant="light" size="sm" onClick={() => setShowModal(true)} className="expand-button">
                        <ExpandIcon />
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="chart-container-small">
                        <Bar options={previewOptions} data={previewData} />
                    </div>
                    {isDataTruncated && <p className="text-muted text-center small mt-2">Mostrando {MAX_LABELS_PREVIEW} de {fullData.labels.length} caracteres. Expanda para ver todos.</p>}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Gráfico de Frecuencia (Expandido)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-chart-wrapper">
                        <div className="chart-container-large" style={{ width: `${largeChartWidth}px`, height: '60vh' }}>
                            <Bar options={modalOptions} data={fullData} />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FreqTable;