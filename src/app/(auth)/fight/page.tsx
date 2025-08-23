'use client'

import React, { useState } from 'react'
import { useAccount } from '@/context/AccountContext'
import {
  useActiveFight,
  useFightParticipants,
  useCreateFight,
  useAddEnemy,
  useJoinFight,
  useUpdateHP,
  useUpdateEnemy,
  useDeleteEnemy,
  useFinishFight,
} from '@/queries/fightQueries'

import InitiativeModal from './InitiativeModal'
import EnemyFormModal from './EnemyFormModal'
import EnemyHpModal from './EnemyHpModal'
import ParticipantItem from './ParticipantItem'
import PlayerFooter from './PlayerFooter'
import DMFooter from './DMFooter'

import ActionButton from '@/ui/ActionButton'
import Input from '@/ui/Input'

export default function CombatPage() {
  const { account } = useAccount()

  const { data: activeFight } = useActiveFight()
  const { data: participants = [], isLoading } = useFightParticipants(activeFight?.id)

  const createFight = useCreateFight()
  const addEnemy = useAddEnemy(activeFight?.id)
  const joinFight = useJoinFight(activeFight?.id)
  const updateHp = useUpdateHP(activeFight?.id)
  const updateEnemy = useUpdateEnemy(activeFight?.id)
  const deleteEnemy = useDeleteEnemy(activeFight?.id)
  const finishFight = useFinishFight(activeFight?.id)

  const normalizeNumber = (val: number | '') => (val === '' ? 0 : val)

  // --- state ---
  const [initiativeInput, setInitiativeInput] = useState<number | ''>('')

  const [showInitiativeModal, setShowInitiativeModal] = useState(false)

  const [showEnemyForm, setShowEnemyForm] = useState(false)
  const [editingEnemy, setEditingEnemy] = useState<any | null>(null)
  const [enemyForm, setEnemyForm] = useState({
    name: '',
    ac: '' as number | '',
    currentHp: '' as number | '',
    maxHp: '' as number | '',
    initiative: '' as number | '',
  })

  const [showEnemyHpModal, setShowEnemyHpModal] = useState(false)
  const [enemyHpInput, setEnemyHpInput] = useState<number | ''>('')
  const [selectedEnemy, setSelectedEnemy] = useState<any | null>(null)

  const isDM = account?.character_name === 'DM'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-light">
        <p>Загрузка...</p>
      </div>
    )
  }

  const myParticipant = participants.find(p => String(p.account_id) === String(account?.id))
  const participantJoined = !!myParticipant

  // --- handlers ---
  const handleJoin = (val: number | '') => {
    joinFight.mutate(normalizeNumber(val))
  }

  const openAddEnemyForm = () => {
    setEditingEnemy(null)
    setEnemyForm({ name: '', ac: '', currentHp: '', maxHp: '', initiative: '' })
    setShowEnemyForm(true)
  }

  const handleSaveEnemy = (payload: any) => {
    if (editingEnemy) {
      updateEnemy.mutate({ id: editingEnemy.id, ...payload })
    } else {
      addEnemy.mutate(payload)
    }
    setShowEnemyForm(false)
  }

  const handleEditEnemy = (enemy: any) => {
    setEditingEnemy(enemy)
    setEnemyForm({
      name: enemy.name,
      ac: enemy.armor_class,
      currentHp: enemy.current_hp,
      maxHp: enemy.max_hp,
      initiative: enemy.initiative,
    })
    setShowEnemyForm(true)
  }

  const handleOpenEnemyHp = (enemy: any) => {
    setSelectedEnemy(enemy)
    setEnemyHpInput(enemy.current_hp)
    setShowEnemyHpModal(true)
  }

  const handleSaveEnemyHp = (val: number | '') => {
    if (!selectedEnemy) return
    updateEnemy.mutate({
      id: selectedEnemy.id,
      name: selectedEnemy.name,
      currentHp: normalizeNumber(val),
      maxHp: selectedEnemy.max_hp,
      ac: selectedEnemy.armor_class,
      initiative: selectedEnemy.initiative,
    })
    setShowEnemyHpModal(false)
  }

  // --- UI ---
  if (activeFight && !isDM && !participantJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-light gap-4">
        <h2 className="text-xl font-bold">Вход в бой</h2>
        <Input
          label="Инициатива"
          type="number"
          value={initiativeInput}
          onChange={e => setInitiativeInput(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <ActionButton type="save" onClick={() => handleJoin(initiativeInput)} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-dark w-screen text-light">
      {/* --- Модалка инициативы --- */}
      <InitiativeModal
        open={showInitiativeModal}
        value={initiativeInput}
        onChange={setInitiativeInput}
        onClose={() => setShowInitiativeModal(false)}
        onSave={() => {
          handleJoin(initiativeInput)
          setShowInitiativeModal(false)
        }}
      />

      <div className="pb-16 p-4">
        {!activeFight ? (
          <div className="text-center">
            <p>Нет активного боя</p>
            {isDM && <ActionButton type="add" onClick={() => createFight.mutate()} />}
          </div>
        ) : (
          <>
            {!isDM ? (
              <div className="flex gap-2 mb-4 justify-end">
                <ActionButton type="edit" onClick={() => setShowInitiativeModal(true)} />
              </div>
            ) : (
              <div className="flex gap-2 mb-4 justify-end">
                <ActionButton type="delete" onClick={() => finishFight.mutate()} />
                <ActionButton type="add" onClick={openAddEnemyForm} />
              </div>
            )}

            <ul className="space-y-2">
              {participants.map(p => (
                <li key={p.id}>
                  <ParticipantItem
                    participant={p}
                    isDM={isDM}
                    onEditEnemy={() => handleEditEnemy(p)}
                    onDeleteEnemy={() => deleteEnemy.mutate(p.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* --- Footer игрока --- */}
      {myParticipant && !isDM && (
        <PlayerFooter
          myParticipant={myParticipant}
          onSave={(v: number | '') => updateHp.mutate(normalizeNumber(v))}
        />
      )}

      {/* --- Footer ДМа --- */}
      {isDM && activeFight && (
        <DMFooter
          enemies={participants.filter((p: any) => p.is_enemy)}
          onEnemyClick={handleOpenEnemyHp}
        />
      )}

      {/* --- Модалки врагов --- */}
      {showEnemyForm && (
        <EnemyFormModal
          open={showEnemyForm}
          onClose={() => setShowEnemyForm(false)}
          formState={[enemyForm, setEnemyForm]}
          onSave={() =>
            handleSaveEnemy({
              name: enemyForm.name,
              currentHp: normalizeNumber(enemyForm.currentHp),
              maxHp: normalizeNumber(enemyForm.maxHp),
              ac: normalizeNumber(enemyForm.ac),
              initiative: normalizeNumber(enemyForm.initiative),
            })
          }
          editingEnemy={editingEnemy}
        />
      )}

      {showEnemyHpModal && selectedEnemy && (
        <EnemyHpModal
          open={showEnemyHpModal}
          onClose={() => setShowEnemyHpModal(false)}
          value={enemyHpInput}
          onChange={setEnemyHpInput}
          onSave={() => handleSaveEnemyHp(enemyHpInput)}
          enemy={selectedEnemy}
        />
      )}
    </div>
  )
}
