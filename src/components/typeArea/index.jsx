import './styles.css'

export default function TypeArea({setMarkdownText}) {
  return (
    <div className="type-area">
        <textarea onChange={(e)=>{setMarkdownText(e.target.value)}} type="text" placeholder="Type a message" />
    </div>
  );
}