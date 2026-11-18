// @ts-expect-error - JSX component without d.ts
import OptionWheel from '../components/ui/OptionWheel';

export default function OptionWheelDemoPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
      <div style={{ height: '400px', width: '300px' }}>
        <OptionWheel
          items={['Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave']}
          defaultSelected={2}
          textColor="#a6a6a6"
          activeColor="#ffffff"
          side="left"
          fontSize={3}
          spacing={1.4}
          curve={1}
          tilt={6}
          blur={2}
          fade={0.25}
          smoothing={200}
          inset={80}
          loop={false}
          draggable
          onChange={(index: number, item: string) => console.log(index, item)}
        />
      </div>
    </div>
  );
}
