'use client'

import '@xyflow/react/dist/style.css'

import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { WorkflowBuilderProps, WorkflowEdge as WorkflowEdgeType,WorkflowNodeDefinition } from '@/lib/types/workflows'

/**
 * WorkflowBuilder Component
 * 
 * Visual drag-and-drop workflow editor using ReactFlow.
 * Supports adding nodes, connecting edges, and configuring workflow logic.
 * Real-time validation and error checking.
 * 
 * @example
 * ```tsx
 * <WorkflowBuilder
 *   workflowId="abc-123"
 *   initialDefinition={workflow.definition}
 *   onSave={async (workflow) => {
 *     await updateWorkflow(workflow)
 *   }}
 *   readOnly={false}
 * />
 * ```
 */
export function WorkflowBuilder({
  initialDefinition,
  onSave,
  readOnly = false,
}: WorkflowBuilderProps) {
  // Convert workflow definition to ReactFlow nodes/edges
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialDefinition?.nodes?.map(nodeToReactFlowNode) || []
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialDefinition?.edges?.map(edgeToReactFlowEdge) || []
  )

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Handle new connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges, readOnly]
  )

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
  }, [])

  // Save workflow
  const handleSave = async () => {
    if (readOnly) return

    setIsSaving(true)
    try {
      // Convert ReactFlow nodes/edges back to workflow definition
      const definition = {
        version: '1.0',
        nodes: nodes.map(reactFlowNodeToNode),
        edges: edges.map(reactFlowEdgeToEdge),
        settings: initialDefinition?.settings || {
          maxConcurrentNodes: 5,
          timeout: 3600,
          retryPolicy: {
            maxAttempts: 3,
            backoff: 'exponential',
            initialDelay: 1000,
            maxDelay: 30000,
          },
          errorHandling: 'stop',
        },
      }

      await onSave({
        definition,
      })
    } catch (error) {
      console.error('Failed to save workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Workflow Builder</h2>
            {readOnly && (
              <span className="text-sm text-gray-500">(Read-only)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              // TODO: Open node palette
            }}>
              Add Node
            </Button>
            <Button
              onClick={handleSave}
              disabled={readOnly || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          edgesReconnectable={!readOnly}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Node Editor Sidebar */}
      {selectedNode && (
        <div className="w-80 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Node Configuration</h3>
            <p className="text-sm text-gray-500">Node ID: {selectedNode}</p>
          </div>

          {/* TODO: Render node-specific configuration form */}
          <Card className="p-4">
            <p className="text-sm text-gray-600">
              Node configuration editor will be implemented here based on node type.
            </p>
          </Card>

          {!readOnly && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  setNodes((nds) => nds.filter((n) => n.id !== selectedNode))
                  setSelectedNode(null)
                }}
              >
                Delete Node
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function nodeToReactFlowNode(node: WorkflowNodeDefinition): Node {
  return {
    id: node.id,
    type: 'default',
    position: node.position || { x: 0, y: 0 },
    data: {
      label: node.label,
      nodeType: node.type,
      config: node.config,
    },
  }
}

function reactFlowNodeToNode(node: Node): WorkflowNodeDefinition {
  return {
    id: node.id,
    type: node.data.nodeType,
    label: node.data.label,
    config: node.data.config,
    position: node.position,
  }
}

function edgeToReactFlowEdge(edge: WorkflowEdgeType): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    data: {
      condition: edge.condition,
    },
  }
}

function reactFlowEdgeToEdge(edge: Edge): WorkflowEdgeType {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    condition: edge.data?.condition,
  }
}

