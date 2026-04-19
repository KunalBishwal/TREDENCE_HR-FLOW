import React from "react";
import { NodeSchema, FormField } from "../../types/workflow.types";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { BaseNodeData } from "../../types/workflow.types";

interface DynamicFormRendererProps {
  schema: NodeSchema;
  nodeData: Partial<BaseNodeData>;
  nodeId: string;
}

const inputBase =
  "w-full px-3 py-2 text-xs rounded-lg transition-all duration-200 bg-space border border-glass-border text-mist placeholder-mist-dim/50 focus:outline-none focus:ring-1 focus:ring-coral/60 focus:border-coral/60 hover:border-mist-dim/30 font-medium";

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  schema,
  nodeData,
  nodeId,
}) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    updateNodeData(nodeId, { [name]: finalValue });
  };

  return (
    <div className="flex flex-col gap-3.5">
      {schema.fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-mist-dim uppercase tracking-wider flex items-center justify-between">
            {field.label}
            {field.required && <span className="text-coral text-[9px] normal-case bg-coral/10 px-1.5 py-0.5 rounded">required</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              name={field.name}
              value={(nodeData[field.name] as string) || ""}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={inputBase}
              required={field.required}
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              name={field.name}
              value={(nodeData[field.name] as number) || ""}
              onChange={handleChange}
              className={inputBase}
              required={field.required}
            />
          )}

          {field.type === "select" && field.options && (
            <select
              name={field.name}
              value={(nodeData[field.name] as string) || field.options[0].value}
              onChange={handleChange}
              className={inputBase + " cursor-pointer"}
              style={{ background: "var(--theme-space-card)", color: "var(--theme-mist)" }}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "var(--theme-space-card)", color: "var(--theme-mist)" }}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "textarea" && (
            <textarea
              name={field.name}
              value={(nodeData[field.name] as string) || ""}
              onChange={handleChange}
              placeholder={`{\n  "key": "value"\n}`}
              className={inputBase + " font-mono min-h-[80px] resize-y"}
              required={field.required}
            />
          )}

          {field.type === "toggle" && (
            <label className="relative inline-flex items-center cursor-pointer w-fit mt-1">
              <input
                type="checkbox"
                name={field.name}
                checked={!!nodeData[field.name]}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-9 h-5 rounded-full peer bg-space border border-glass-border peer-checked:bg-coral peer-checked:border-coral-dark after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-mist after:shadow-sm after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white transition-all"></div>
            </label>
          )}
        </div>
      ))}
    </div>
  );
};
