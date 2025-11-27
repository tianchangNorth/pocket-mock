
export interface MockRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any; // Raw body
  json: any; // Parsed JSON body if content-type is application/json
  params: Record<string, string>; // Path parameters from rule matching
  query: Record<string, string>; // Query parameters
}

export type DynamicResponseFunction = (req: MockRequest) => any | Promise<any>;

export interface MockRule {
  id: string;
  url: string;
  method: string;
  response: any | DynamicResponseFunction;
  enabled: boolean;
  delay: number;
  status: number;
  headers: Record<string, string>;
}
