const {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
const WEATHER_STATES = [{
  name: "STILL AIR",
  note: "The browser is holding its breath.",
  color: "#a7c9d9"
}, {
  name: "CROSSWIND",
  note: "A thought moved quickly from left to right.",
  color: "#d7ff72"
}, {
  name: "DRIZZLE",
  note: "Small weather has entered the interface.",
  color: "#73c9ff"
}, {
  name: "DOWNPOUR",
  note: "The cursor has become a low-pressure event.",
  color: "#8da0ff"
}, {
  name: "ELECTRIC",
  note: "The atmosphere is taking this personally.",
  color: "#ffef75"
}];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const format = (value, suffix = "") => `${Math.round(value)}${suffix}`;
function useBrowserWeather() {
  const pointer = useRef({
    x: innerWidth * .55,
    y: innerHeight * .5,
    px: innerWidth * .55,
    py: innerHeight * .5,
    time: performance.now()
  });
  const physics = useRef({
    speed: 0,
    windX: 0,
    windY: 0,
    pressure: 1013,
    humidity: 28,
    storm: 0,
    lastMove: performance.now()
  });
  const [weather, setWeather] = useState({
    ...physics.current,
    state: WEATHER_STATES[0],
    direction: "CALM",
    x: pointer.current.x,
    y: pointer.current.y
  });
  useEffect(() => {
    const onMove = event => {
      const now = performance.now();
      const dt = Math.max(8, now - pointer.current.time);
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      const rawSpeed = Math.hypot(dx, dy) / dt * 18;
      pointer.current = {
        x: event.clientX,
        y: event.clientY,
        px: pointer.current.x,
        py: pointer.current.y,
        time: now
      };
      physics.current.speed = clamp(lerp(physics.current.speed, rawSpeed, .42), 0, 42);
      physics.current.windX = clamp(lerp(physics.current.windX, dx / dt * 28, .3), -26, 26);
      physics.current.windY = clamp(lerp(physics.current.windY, dy / dt * 20, .3), -18, 18);
      physics.current.lastMove = now;
    };
    window.addEventListener("pointermove", onMove, {
      passive: true
    });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useEffect(() => {
    let frame;
    let lastUi = 0;
    const update = now => {
      const idle = now - physics.current.lastMove;
      const targetStorm = clamp(physics.current.speed / 28 + (idle < 150 ? .15 : 0), 0, 1);
      physics.current.storm = lerp(physics.current.storm, targetStorm, targetStorm > physics.current.storm ? .075 : .012);
      physics.current.humidity = lerp(physics.current.humidity, 24 + physics.current.storm * 72, .025);
      physics.current.pressure = lerp(physics.current.pressure, 1016 - physics.current.storm * 31, .018);
      if (idle > 90) physics.current.speed *= .967;
      if (idle > 350) {
        physics.current.windX *= .984;
        physics.current.windY *= .984;
      }
      if (now - lastUi > 45) {
        const storm = physics.current.storm;
        const stateIndex = storm > .82 ? 4 : storm > .59 ? 3 : storm > .34 ? 2 : Math.abs(physics.current.windX) > 3 ? 1 : 0;
        const angle = Math.atan2(physics.current.windY, physics.current.windX) * 180 / Math.PI;
        const direction = Math.abs(physics.current.windX) < 1.2 && Math.abs(physics.current.windY) < 1.2 ? "CALM" : angle > -45 && angle <= 45 ? "EAST" : angle > 45 && angle <= 135 ? "SOUTH" : angle <= -45 && angle > -135 ? "NORTH" : "WEST";
        setWeather({
          ...physics.current,
          state: WEATHER_STATES[stateIndex],
          direction,
          x: pointer.current.x,
          y: pointer.current.y
        });
        lastUi = now;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);
  const pressureBurst = useCallback((x, y) => {
    physics.current.storm = clamp(physics.current.storm + .24, 0, 1);
    physics.current.speed = clamp(physics.current.speed + 9, 0, 42);
    physics.current.pressure = Math.max(978, physics.current.pressure - 8);
    physics.current.lastMove = performance.now();
    pointer.current.x = x;
    pointer.current.y = y;
  }, []);
  const clearWeather = useCallback(() => {
    physics.current.speed = 0;
    physics.current.windX = 0;
    physics.current.windY = 0;
    physics.current.storm = 0;
    physics.current.pressure = 1016;
    physics.current.humidity = 24;
    physics.current.lastMove = 0;
  }, []);
  return {
    weather,
    pressureBurst,
    clearWeather
  };
}
function WeatherCanvas({
  weather,
  bursts
}) {
  const canvasRef = useRef(null);
  const weatherRef = useRef(weather);
  const particlesRef = useRef([]);
  const cloudsRef = useRef([]);
  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame;
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cloudsRef.current = Array.from({
        length: 16
      }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height * .72,
        size: 80 + Math.random() * 260,
        depth: .2 + Math.random() * .8,
        phase: index * .7
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const spawnRain = (amount, activeWeather) => {
      for (let index = 0; index < amount; index++) {
        particlesRef.current.push({
          x: Math.random() * (width + 300) - 150,
          y: -30 - Math.random() * 120,
          length: 8 + Math.random() * 25 * activeWeather.storm,
          speed: 8 + Math.random() * 15,
          life: 1,
          kind: Math.random() < .94 ? "rain" : "spark"
        });
      }
    };
    const draw = time => {
      const active = weatherRef.current;
      context.clearRect(0, 0, width, height);
      const wash = context.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, `rgba(25, 55, 81, ${.08 + active.storm * .16})`);
      wash.addColorStop(.55, `rgba(23, 36, 63, ${.05 + active.storm * .22})`);
      wash.addColorStop(1, `rgba(82, 42, 88, ${active.storm * .13})`);
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);
      cloudsRef.current.forEach(cloud => {
        cloud.x += active.windX * .018 * cloud.depth;
        if (cloud.x > width + cloud.size) cloud.x = -cloud.size;
        if (cloud.x < -cloud.size) cloud.x = width + cloud.size;
        const pulse = 1 + Math.sin(time * .0002 + cloud.phase) * .07;
        const gradient = context.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size * pulse);
        gradient.addColorStop(0, `rgba(154, 184, 210, ${.035 + active.storm * .08 * cloud.depth})`);
        gradient.addColorStop(.45, `rgba(75, 101, 133, ${.025 + active.storm * .07})`);
        gradient.addColorStop(1, "rgba(15, 28, 45, 0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(cloud.x, cloud.y, cloud.size * pulse, 0, Math.PI * 2);
        context.fill();
      });
      spawnRain(Math.floor(active.storm * 4.8), active);
      particlesRef.current = particlesRef.current.filter(drop => {
        drop.x += active.windX * .34;
        drop.y += drop.speed + active.windY * .12;
        drop.life -= .002;
        if (drop.kind === "spark") {
          context.fillStyle = `rgba(255, 239, 117, ${drop.life * active.storm})`;
          context.fillRect(drop.x, drop.y, 2, 2);
        } else {
          context.strokeStyle = `rgba(146, 205, 255, ${(.13 + active.storm * .48) * drop.life})`;
          context.lineWidth = .6 + active.storm;
          context.beginPath();
          context.moveTo(drop.x, drop.y);
          context.lineTo(drop.x + active.windX * .55, drop.y + drop.length);
          context.stroke();
        }
        return drop.y < height + 80 && drop.life > 0;
      }).slice(-900);
      bursts.forEach(burst => {
        const age = (Date.now() - burst.time) / 1300;
        if (age > 1) return;
        context.strokeStyle = `rgba(215,255,114,${(1 - age) * .45})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(burst.x, burst.y, 20 + age * 190, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(burst.x, burst.y, 8 + age * 110, 0, Math.PI * 2);
        context.stroke();
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [bursts]);
  return React.createElement("canvas", {
    ref: canvasRef,
    className: "weather-canvas",
    "aria-hidden": "true"
  });
}
function WindCompass({
  weather
}) {
  const angle = Math.atan2(weather.windY, weather.windX) * 180 / Math.PI;
  return React.createElement("div", {
    className: "compass",
    "aria-label": `Wind direction ${weather.direction}`
  }, React.createElement("span", null, "N"), React.createElement("span", null, "E"), React.createElement("span", null, "S"), React.createElement("span", null, "W"), React.createElement("i", {
    style: {
      transform: `translate(-50%,-50%) rotate(${angle + 90}deg)`
    }
  }), React.createElement("b", null, weather.direction));
}
function WeatherLog({
  log
}) {
  return React.createElement("aside", {
    className: "weather-log"
  }, React.createElement("header", null, React.createElement("span", null, "RECENT SYSTEMS"), React.createElement("b", null, String(log.length).padStart(2, "0"))), React.createElement("div", null, log.length ? log.map(entry => React.createElement("article", {
    key: entry.id
  }, React.createElement("time", null, entry.time), React.createElement("b", null, entry.name), React.createElement("span", null, entry.wind, " / ", entry.pressure))) : React.createElement("p", null, "MOVE QUICKLY ENOUGH TO LEAVE A WEATHER RECORD.")));
}
function App() {
  const {
    weather,
    pressureBurst,
    clearWeather
  } = useBrowserWeather();
  const [bursts, setBursts] = useState([]);
  const [log, setLog] = useState([]);
  const previousState = useRef(weather.state.name);
  useEffect(() => {
    if (weather.state.name !== previousState.current) {
      previousState.current = weather.state.name;
      setLog(old => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        name: weather.state.name,
        wind: format(Math.abs(weather.windX) + Math.abs(weather.windY), " KT"),
        pressure: format(weather.pressure, " HPA")
      }, ...old].slice(0, 4));
    }
  }, [weather.state.name]);
  const makeBurst = event => {
    if (event.target.closest("button, a")) return;
    const burst = {
      id: Date.now(),
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    };
    setBursts(old => [...old.filter(item => Date.now() - item.time < 1400), burst]);
    pressureBurst(event.clientX, event.clientY);
  };
  const intensity = Math.round(weather.storm * 100);
  const conditions = useMemo(() => [["WIND", format(Math.abs(weather.windX) + Math.abs(weather.windY), " KT")], ["PRESSURE", format(weather.pressure, " HPA")], ["HUMIDITY", format(weather.humidity, "%")], ["ACTIVITY", format(weather.speed * 2.4, "%")]], [weather]);
  return React.createElement("main", {
    className: `weather-app storm-${intensity > 70 ? "high" : intensity > 30 ? "mid" : "low"}`,
    style: {
      "--storm": weather.storm,
      "--weather-color": weather.state.color,
      "--cursor-x": `${weather.x}px`,
      "--cursor-y": `${weather.y}px`
    },
    onPointerDown: makeBurst
  }, React.createElement(WeatherCanvas, {
    weather: weather,
    bursts: bursts
  }), React.createElement("div", {
    className: "atmosphere",
    "aria-hidden": "true"
  }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)), React.createElement("header", {
    className: "topbar"
  }, React.createElement("div", {
    className: "brand"
  }, React.createElement("i", null), "BROWSER WEATHER"), React.createElement("p", null, "THE FORECAST IS WHATEVER YOUR HAND IS DOING"), React.createElement("div", {
    className: "station"
  }, "STATION ", React.createElement("b", null, "BW—01"))), React.createElement("section", {
    className: "hero"
  }, React.createElement("div", {
    className: "eyebrow"
  }, React.createElement("span", null, "LIVE CONDITIONS"), React.createElement("i", null), " ", React.createElement("b", null, String(intensity).padStart(3, "0"), "%")), React.createElement("h1", null, React.createElement("span", null, "YOUR"), React.createElement("span", null, "BROWSER"), React.createElement("em", null, "has weather.")), React.createElement("p", {
    className: "instruction"
  }, "MOVE SLOWLY FOR WIND. MOVE QUICKLY FOR RAIN.", React.createElement("br", null), "CLICK ANYWHERE TO CREATE A PRESSURE EVENT.")), React.createElement("section", {
    className: "condition-card"
  }, React.createElement("header", null, React.createElement("span", null, "CURRENT SYSTEM"), React.createElement("b", null, "LIVE")), React.createElement("div", {
    className: "condition-name"
  }, React.createElement("small", null, String(WEATHER_STATES.indexOf(weather.state) + 1).padStart(2, "0")), React.createElement("h2", null, weather.state.name)), React.createElement("p", null, weather.state.note), React.createElement("div", {
    className: "meter"
  }, React.createElement("i", {
    style: {
      width: `${intensity}%`
    }
  })), React.createElement("footer", null, React.createElement("span", null, "INTENSITY"), React.createElement("b", null, String(intensity).padStart(3, "0")))), React.createElement("section", {
    className: "telemetry"
  }, conditions.map(([label, value]) => React.createElement("div", {
    key: label
  }, React.createElement("span", null, label), React.createElement("b", null, value)))), React.createElement(WindCompass, {
    weather: weather
  }), React.createElement(WeatherLog, {
    log: log
  }), React.createElement("button", {
    className: "clear-button",
    type: "button",
    onClick: clearWeather
  }, "CLEAR THE SKY ", React.createElement("i", null, "↗")), React.createElement("div", {
    className: "cursor-front",
    "aria-hidden": "true"
  }, React.createElement("i", null), React.createElement("span", null, weather.state.name)), React.createElement("footer", {
    className: "ticker"
  }, React.createElement("div", null, "CURSOR VELOCITY IS NOT A RECOGNIZED METEOROLOGICAL INSTRUMENT \xA0•\xA0 LOCAL FORECAST VALID ONLY INSIDE THIS TAB \xA0•\xA0 CLICK TO CREATE LOW PRESSURE \xA0•\xA0 REMAIN STILL FOR CLEARING \xA0•\xA0 CURSOR VELOCITY IS NOT A RECOGNIZED METEOROLOGICAL INSTRUMENT \xA0•\xA0")));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
