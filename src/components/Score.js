export default function Score({ n }) {
  let text = ""  
  if (n > -1) {
      text = n;
    }
    return <span>{text}</span>;
  }