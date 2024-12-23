// app/api/service-map/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const namespace = req.nextUrl.searchParams.get('namespace') || 'default';

    // Query Pixie GraphQL API
    // Prepare your GraphQL query or pxL script
    const query = `
    {
      runScript(
        scriptName: "service_graph"
        clusterId: "2e4d2d36-55d1-4514-a024-32fcdc0b21a0"
        tableName: "service_map_table"
        pxlArgs: { "remote_ns": "${namespace}" }
      ) {
        tables {
          name
          data {
            rows {
              string_columns
            }
          }
        }
      }
    }
    `;

    // Run the GraphQL query
    const response = await fetch('https://work.getcosmic.ai/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer px-api-074921ba-4f71-4f8b-bce2-4a9292950c23`,
      },
      body: JSON.stringify({ query }),
    });

    // Log the raw response for debugging
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check if the response is ok (status in 200-299 range)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch service map data' },
        { status: response.status }
      );
    }

    // Check if response is empty
    const text = await response.text();
    if (!text) {
      console.error('Empty response received');
      return NextResponse.json(
        { error: 'Empty response from service' },
        { status: 500 }
      );
    }

    // Try to parse the JSON
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json(
        { error: 'Invalid JSON response' },
        { status: 500 }
      );
    }

    console.log(`response ${JSON.stringify(json, null, 2)}`)
    // Parse json to extract service map edges/nodes.
    // The structure depends on Pixie’s actual output schema.
    // Suppose we get something like rows with columns [src_service, src_ns, dest_service, dest_ns, rps, latency]
    
    const tables = json.data.runScript.tables;
    const serviceMapTable = tables.find((t: any) => t.name === 'service_map_table');
    const edgesData = serviceMapTable.data.rows.map((row: any) => {
      const [src, srcNs, dest, destNs, rps, latency] = row.string_columns;
      return { source: `${src}.${srcNs}`, target: `${dest}.${destNs}`, rps: parseFloat(rps), latency: parseFloat(latency) };
    });
    
    // Extract a unique list of nodes from edges
    const nodesSet = new Set<string>();
    edgesData.forEach((edge: any) => {
      nodesSet.add(edge.source);
      nodesSet.add(edge.target);
    });
    const nodesData = Array.from(nodesSet).map((id) => ({ id }));

    return NextResponse.json({ nodes: nodesData, edges: edgesData });
  } catch (error) {
    console.error('Service Map API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
