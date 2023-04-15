import  './App.css'
import { useState } from 'react';
import MarkdownParser from './components/markdownParser';
import ReactMarkdown from 'react-markdown';
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import TypeArea from './components/typeArea';
import { useEffect } from 'react';
import Button from './components/buttons';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';
import htmlToPdf from 'html-to-pdf';
import Promise from 'bluebird';
import { invoke } from '@tauri-apps/api'
import { path } from '@tauri-apps/api';
import { writeTextFile,writeBinaryFile,writeFile } from '@tauri-apps/api/fs';
import { fs } from '@tauri-apps/api';
import { BaseDirectory } from '@tauri-apps/api/path';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// 将页面转换为PDF
async function generatePdf(htmlContent) {
  // 生成PDF的选项
  const options = {
    inputBody: htmlContent,
    pageSize: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm',
    },
  };

  // 将HTML内容转换为PDF文件
  const pdf = await Promise.promisify(htmlToPdf)(options);
  const pdfFilePath = path.join(__dirname, 'output.pdf');
  await Promise.promisify(fs.writeFile)(pdfFilePath, pdf);

  console.log('PDF file saved to disk:', pdfFilePath);
}

function App() {
  const [markdownText, setMarkdownText] = useState('')
  const [showMarkdown, setShowMarkdown] = useState(false)
  const outputFilePath = './output.html';
  const pdfRef = useRef(null);

  const [htmlContent, setHtmlContent] = useState('');

  // 获取HTML内容
  useEffect(() => {
    const getHtmlContent = async () => {
      const html = ReactDOMServer.renderToString(
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      );
      // const content = await tauri.promisified.eval("document.documentElement.outerHTML");
      setHtmlContent(html);
    };
    getHtmlContent();
  }, [markdownText]);
  
  const saveHtml = () => {
    const html = ReactDOMServer.renderToString(
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    );
    // save the html to a file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.html';
    link.click();
    URL.revokeObjectURL(url);
  }


  const saveAsPDF = () => {
    html2pdf()
      .set({ html2canvas: { scale: 4 } })
      .from(pdfRef.current)
      .save('output.pdf');
  }
  // const saveAsPDFInTauri = async () => {
  //   const html = ReactDOMServer.renderToString(
  //     <ReactMarkdown>{markdownText}</ReactMarkdown>
  //   );
  //   const downloadDir = BaseDirectory.Desktop
  //   const fileName = 'output.pdf';
  //   const fileContent = html2pdf()
  //           .set({ html2canvas: { scale: 4 } })
  //           .from(pdfRef.current)
  //           .save('output.pdf');
  //   // await writeBinaryFile(fileName, fileContent, { dir: downloadDir })
  //   // await writeFile(fileName, fileContent, { dir: downloadDir });
  //   // await writeTextFile(fileName, fileContent, { dir: downloadDir });

  // }

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    onAfterPrint: async () => {
      const input = pdfRef.current;
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save('download.pdf');
    }
  });
  return (
    <>
    
    <div className=' flex flex-col items-start w-[100vw] h-[100vh] overflow-scroll'>
    <div className={` fixed top-0 h-16 min-h-[4rem] w-full 
     inline-flex justify-start items-center
      border-stone-300 border-solid border-t-0 border-x-0 px-4 
      gap-2`}>
        <Button  onClick={()=>{saveHtml()}
        }>
        <PencilSquareIcon className=' w-4 h-4 mr-2'/>
        Save HTML
        </Button>
        <Button  onClick={()=>{saveAsPDF()}
        }>
        <PencilSquareIcon className=' w-4 h-4 mr-2'/>
        Save as PDF
        </Button>
        <Button  onClick={()=>{ handlePrint()}}>
        <PencilSquareIcon  className=' w-4 h-4 mr-2'/>
        Save as PDF In Tauri
        </Button>
      <Button  onClick={()=>{
        setShowMarkdown(!showMarkdown)}}>
        <PencilSquareIcon className=' w-4 h-4 mr-2'/>
        Edit
        </Button>
    </div>
    <div className=' fixed top-16 inline-flex w-full h-full'>
      <div className={`w-1/2 h-full p-4 
      border-stone-300 border-solid border-l-0 border-y-0 transition-all 
      ${showMarkdown?' ':'hidden'}` } >
        <TypeArea setMarkdownText={setMarkdownText} />
      </div>
      <div ref={pdfRef} className={` transition-all h-full p-4 ${showMarkdown?' w-1/2':' w-full'}` }>
      <MarkdownParser markdown={markdownText} />
      </div>
    </div>
    </div>
    </>
  )
}


export default App



//   const markdownText = `
// # This is a heading
// ## This is a heading
// ### A demo of  \`react-markdown\`

// This is some **bold** text.

// * This is a list item
// * Another list item
//   `;