import {
  Stage,
  Graphics,
  useTick,
  PixiComponent,
  Container,
} from "@inlet/react-pixi";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import useInterval from "react-useinterval";

export default function App() {
  return (
    <Stage
      width={800}
      height={600}
      style={{ width: 800, height: 600 }}
      options={{ antialias: true, backgroundColor: 0x000000 }}
    >
      <Orbits x={400} y={300} />
      <Orbits
        x={400}
        y={300}
        delay={120}
        alpha={0.3}
        scale={new PIXI.Point(1.7, 1.7)}
      />
      {/* <Orbits x={500} y={400} delay={120} /> */}
      <Randoms />
    </Stage>
  );
}

function Orbits({ x, y, delay = 0, ...rest }) {
  const [ticker, setTicker] = useState(-delay);
  useTick((delta) => {
    setTicker((prev) => prev + delta);
  });

  const swiggle = 50 + Math.sin(ticker / 20) * 25;
  const swiggleSmall = 50 + Math.sin(ticker / 20 + Math.PI / 2) * 5;

  return (
    <Container x={x} y={y} angle={ticker} {...rest}>
      <Container x={-100} y={0} angle={ticker}>
        <Circle fill={0xb9e3c6} x={0} y={0} radius={swiggleSmall} />
        <Circle fill={0x23395b} x={-50} y={0} radius={50} />
      </Container>
      <Circle fill={0xfffd98} x={0} y={0} radius={swiggle} />
      <Container x={100} y={0} angle={ticker}>
        <Circle fill={0x59c9a5} x={0} y={0} radius={swiggleSmall} />
        <Circle fill={0xd81e5b} x={50} y={0} radius={50} />
      </Container>
    </Container>
  );
}

const COLORS = [0xb9e3c6, 0x23395b, 0xfffd98, 0x59c9a5, 0xd81e5b];

const Circle = PixiComponent<
  {
    fill: any;
    x: number;
    y: number;
    radius: number;
  },
  PIXI.Graphics
>("Circle", {
  create: () => new PIXI.Graphics(),
  applyProps: (g, _, props) => {
    const { fill, x, y, radius } = props;

    g.blendMode = PIXI.BLEND_MODES.ADD;
    g.clear();
    g.beginFill(fill, 0.9);
    g.drawCircle(x, y, radius);
    g.endFill();
  },
});

let counter = 0;
function useLifecycles() {
  const itemsRef = useRef<
    Array<{
      id: number;
      duration: number;
      start: number;
      params: any;
      progress: number;
    }>
  >([]);

  const [ticker, setTicker] = useState(0);
  useTick((delta) => {
    const current = ticker + delta;
    setTicker((prev) => prev + delta);
    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      item.progress = (current - item.start) / item.duration;

      if (item.progress >= 1) {
        itemsRef.current.splice(i, 1);
        i--;
      }
    }
  });

  function createItem(frames, params) {
    itemsRef.current.push({
      id: counter++,
      duration: frames,
      start: ticker,
      params,
      progress: 0,
    });
  }
  return [itemsRef.current, createItem] as const;
}

function Randoms() {
  const [items, createItem] = useLifecycles();

  useInterval(() => {
    createItem(150, {
      x: Math.random() * 800,
      y: Math.random() * 600,
      radius: 30 + Math.random() * 50,
    });
  }, 1000);

  return items.map((item) => (
    <Circle
      key={item.id}
      fill={COLORS[item.id % 5]}
      x={item.params.x}
      y={item.params.y}
      radius={item.params.radius - item.progress * item.params.radius}
    />
  ));
}
