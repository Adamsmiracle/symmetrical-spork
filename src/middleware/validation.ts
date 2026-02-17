import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface ValidationRule {
  param: string;
  type: 'query' | 'body';
  required?: boolean;
  enum?: string[];
  min?: number;
  max?: number;
}

export function validateRequest(rules: ValidationRule[]) {
  return async (request: NextRequest) => {
    const url = new URL(request.url);
    const errors: any[] = [];

    for (const rule of rules) {
      let value;
      
      if (rule.type === 'query') {
        value = url.searchParams.get(rule.param);
      } else {
        try {
          const body = await request.json();
          value = body[rule.param];
        } catch {
          // Body might not be JSON
        }
      }

      if (rule.required && !value) {
        errors.push({
          msg: `${rule.param} is required`,
          param: rule.param,
          location: rule.type
        });
        continue;
      }

      if (rule.enum && value && !rule.enum.includes(value)) {
        errors.push({
          msg: `${rule.param} must be one of: ${rule.enum.join(', ')}`,
          param: rule.param,
          location: rule.type
        });
      }

      if (rule.type === 'query' && rule.min !== undefined) {
        const num = parseInt(value);
        if (num < rule.min) {
          errors.push({
            msg: `${rule.param} must be at least ${rule.min}`,
            param: rule.param,
            location: rule.type
          });
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    return null;
  };
}
