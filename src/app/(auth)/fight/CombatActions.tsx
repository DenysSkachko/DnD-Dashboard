'use client'

import ActionButton from '@/ui/ActionButton'
import { useFinishFight } from '@/queries/fightQueries'

type Props = {
  isDM: boolean
  participantJoined: boolean
  setShowInitiativeModal: (value: boolean) => void
  setShowEnemyForm: (value: boolean) => void
  finishFightId?: number
}

export default function CombatActions({
  isDM,
  participantJoined,
  setShowInitiativeModal,
  setShowEnemyForm,
  finishFightId,
}: Props) {
  const finishFight = useFinishFight(finishFightId)

  return (
    <div className="flex gap-2 mb-4 justify-end px-4">
      {isDM ? (
        <>
          <ActionButton type="delete" onClick={() => finishFight.mutate()} />
          <ActionButton type="add" onClick={() => setShowEnemyForm(true)} />
        </>
      ) : (
        participantJoined && (
          <ActionButton type="edit" onClick={() => setShowInitiativeModal(true)} />
        )
      )}
    </div>
  )
}
