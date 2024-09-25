interface ISpacing {
  height?: number;
}

export const Spacing = ({ height = 20 }: ISpacing) => (
  // <div style={{ height: `${height}px`, backgroundColor: 'red' }}></div>
  <div style={{ height: `${height}px` }}></div>
);
