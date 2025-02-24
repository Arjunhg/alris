import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import CanvasControls from '../components/canvas/CanvasControls';
import HistoryPanel from '../features/calculator/HistoryPanel';
import { Button } from '../components/ui/button';
import { IconHistory, IconCalculator } from '@tabler/icons-react';
import { debounce } from '../utils/debounce';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface HistoryItem {
    expression: string;
    result: string;
    timestamp: Date;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [brushSize, setBrushSize] = useState(3);
    const [currentMode, setCurrentMode] = useState<'brush' | 'eraser'>('brush');
    const [history, setHistory] = useState<Array<HistoryItem>>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const renderLatexToCanvas = useCallback((expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression((prev) => [...prev, latex]);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    const debouncedRenderLatex = useCallback(() => {
        debounce(() => {
            if (window.MathJax) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }
        }, 500)();
    }, []);

    useEffect(() => {
        if (latexExpression.length > 0) {
            debouncedRenderLatex();
        }
    }, [latexExpression, debouncedRenderLatex]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result, renderLatexToCanvas]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }

        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
            });
        };

        return () => {
            document.head.removeChild(script);
        };

    }, []);

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
    
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = currentMode === 'eraser' ? 'black' : color;
                ctx.lineWidth = brushSize;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };
    const stopDrawing = () => {
        setIsDrawing(false);
    };  

    const handleHistoryItemClick = (item: HistoryItem) => {
        setResult({
            expression: item.expression,
            answer: item.result
        });
        setIsHistoryOpen(false);
    };

    const runRoute = async () => {
        setLoading(true);
        setError(null);
        const canvas = canvasRef.current;
    
        if (canvas) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_API_URL}/calculate`,
                    data: {
                        image: canvas.toDataURL('image/png'),
                        dict_of_vars: dictOfVars
                    }
                });

                const resp = await response.data;
                console.log('Response', resp);
                resp.data.forEach((data: Response) => {
                    if (data.assign === true) {
                        setDictOfVars({
                            ...dictOfVars,
                            [data.expr]: data.result
                        });
                    }
                });
                const ctx = canvas.getContext('2d');
                const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                setLatexPosition({ x: centerX, y: centerY });
                resp.data.forEach((data: Response) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result
                        });
                    }, 1000);
                });

                // Add to history
                resp.data.forEach((data: Response) => {
                    setHistory(prev => [...prev, {
                        expression: data.expr,
                        result: data.result,
                        timestamp: new Date()
                    }]);
                });

            } catch (error) {
                setError('Failed to process the image. Please try again.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {loading && <LoadingIndicator />}
            {error && <ErrorMessage message={error} />}
            
            <div className="fixed top-4 right-4 z-30 flex gap-2">
                <Button
                    onClick={runRoute}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                >
                    <IconCalculator className="mr-2" size={20} />
                    Calculate
                </Button>
                <Button
                    onClick={() => setIsHistoryOpen(true)}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    size="lg"
                >
                    <IconHistory className="mr-2" size={20} />
                    History
                </Button>
            </div>

            <CanvasControls
                color={color}
                setColor={setColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                onReset={() => setReset(true)}
                onModeChange={setCurrentMode}
                currentMode={currentMode}
            />

            <canvas
                ref={canvasRef}
                id="canvas"
                className="absolute top-0 left-0 w-full h-full bg-black"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                >
                    <div className="absolute p-4 backdrop-blur-md bg-black/40 rounded-lg shadow-xl border border-gray-700 cursor-move">
                        <div className="latex-content text-2xl text-white">{latex}</div>
                    </div>
                </Draggable>
            ))}

            <HistoryPanel
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onHistoryItemClick={handleHistoryItemClick}
            />
        </div>
    );
}
