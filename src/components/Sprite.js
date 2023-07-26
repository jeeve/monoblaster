export default function Sprite({ x, y, image }) {
    const style = {
      left: x,
      top: y,
    };
  
    return <img style={style} src={image} alt="" />;
  }
  