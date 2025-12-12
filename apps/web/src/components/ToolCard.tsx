import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export type Tool = {
  name: string;
  description: string;
  status?: 'beta' | 'ga' | 'soon';
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-slate-500">Status: {tool.status ?? 'available'}</div>
      </CardContent>
    </Card>
  );
}
