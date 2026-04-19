import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  OnSelectionChangeParams,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { customNodeTypes, nodeRegistry } from "../../nodes/registry";
import { v4 as uuidv4 } from "uuid";
import { CustomEdge, EdgeMarkerDefs } from "../../components/edges/CustomEdge";
import type { EdgeStyleType, EdgeArrowType } from "../../components/edges/CustomEdge";
import { EdgeToolbar } from "../../components/edges/EdgeToolbar";

const CanvasInner: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, addNode, setSelectedNode } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const lastSelectedRef = useRef<string | null>(null);

  const [edgeStyle, setEdgeStyle] = useState<EdgeStyleType>("default");
  const [arrowType, setArrowType] = useState<EdgeArrowType>("arrowClosed");

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            animated: edgeStyle === "default",
            data: { edgeStyle, arrowType },
          },
          eds
        )
      );
    },
    [setEdges, edgeStyle, arrowType]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;
      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const registryEntry = nodeRegistry[type];
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {
          id: uuidv4(),
          type: type as any,
          ...registryEntry?.defaultData,
        },
      };
      addNode(newNode);
    },
    [project, addNode]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const nextId = selectedNodes.length > 0 ? selectedNodes[0].id : null;
      if (nextId !== lastSelectedRef.current) {
        lastSelectedRef.current = nextId;
        setSelectedNode(nextId);
      }
    },
    [setSelectedNode]
  );

  const nodeTypes = useMemo(() => customNodeTypes, []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  return (
    <div
      className="flex-1 h-full w-full relative bg-transparent bg-theme-transition"
      ref={reactFlowWrapper}
    >
      <EdgeMarkerDefs />

      <div className="absolute top-3 left-3 z-20">
        <EdgeToolbar
          selectedEdgeStyle={edgeStyle}
          selectedArrowType={arrowType}
          onEdgeStyleChange={setEdgeStyle}
          onArrowTypeChange={setArrowType}
        />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => instance.fitView()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onSelectionChange={onSelectionChange}
        defaultEdgeOptions={{ type: "custom", animated: false }}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} color="var(--theme-coral-glow)" gap={28} size={1} />
        <Controls />
        <MiniMap nodeStrokeWidth={2} pannable zoomable />
      </ReactFlow>
    </div>
  );
};

export const Canvas: React.FC = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);
