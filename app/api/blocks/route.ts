import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

export async function GET(request: Request) {
  try {
    // TODO: 실제 인증 구현 전까지는 임시 userId 사용
    const userId = 'test-user'
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const blocks = await blockService.getBlocks(userId, date)
    return NextResponse.json(blocks)
  } catch (error) {
    console.error('Error fetching blocks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = 'test-user'
    const blockData = await request.json()
    
    const block = await blockService.createBlock(userId, blockData)
    return NextResponse.json(block)
  } catch (error) {
    console.error('Error creating block:', error)
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    )
  }
} 