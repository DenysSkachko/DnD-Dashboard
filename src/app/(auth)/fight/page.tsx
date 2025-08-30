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
  useCharacterCombat,
} from '@/queries/fightQueries'

import InitiativeModal from './InitiativeModal'
import EnemyFormModal from './EnemyFormModal'
import EnemyHpModal from './EnemyHpModal'
import ParticipantItem from './ParticipantItem'
import PlayerFooter from './PlayerFooter'
import DMFooter from './DMFooter'
import ActionButton from '@/ui/ActionButtonFight'

import Input from '@/ui/Input'
import { Loader } from '@/ui/Loader'

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

  const normalizeNumber = (val: number | '') => {
    if (val === '' || isNaN(Number(val))) return 0
    return Math.max(0, Number(val))
  }

  const { data: characterCombat } = useCharacterCombat(account?.id)
  const initiativeBonus = characterCombat?.initiative ?? 0

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
    return <Loader />
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
      <div
        className="flex flex-col items-center justify-center h-screen gap-6
      px-6
      bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
      backdrop-blur-md"
      >
        {/* Заголовок */}
        <h2
          className="text-2xl font-extrabold uppercase tracking-widest text-light
        drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] text-center"
        >
          Вход в бой
        </h2>

        {/* Input инициативы */}
        <input
          type="number"
          value={initiativeInput}
          onChange={e => setInitiativeInput(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full max-w-xs h-14 pl-6 rounded-2xl text-2xl font-extrabold outline-none
        bg-gradient-to-br from-red-900 via-red-800 to-red-950
        text-red-400 shadow-[0_0_15px_rgba(255,0,0,0.6)]
        focus:border-red-400 focus:shadow-[0_0_25px_rgba(255,80,80,0.8)]
        transition-all duration-300
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="0"
        />

        {/* Бонус инициативы */}
        <div className="w-full max-w-xs flex justify-between text-sm text-stone-300 px-2">
          <span>Твой бонус к инициативе:</span>
          <span className="font-bold text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">
            {initiativeBonus >= 0 ? `+${initiativeBonus}` : initiativeBonus}
          </span>
        </div>

        {/* Кнопка Войти */}
        <ActionButton
          type="save"
          onClick={() => handleJoin(initiativeInput)}
          className="w-14 h-14 text-2xl"
        />
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen w-screen text-light 
  bg-gradient-to-br from-black via-red-900 to-red-950
  animate-danger-gradient overflow-hidden"
    >
      <div className="absolute inset-0 bg-red-700/20 animate-danger-pulse"></div>
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
        initiativeBonus={initiativeBonus}
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
              <div className="flex gap-2 mb-4 justify-start">
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
                    onEditEnemy={() => p.is_enemy && handleEditEnemy(p)}
                    onDeleteEnemy={() => p.is_enemy && deleteEnemy.mutate(p.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* --- Footer игрока --- */}
      {activeFight && myParticipant && (
        <PlayerFooter
          myParticipant={myParticipant}
          onSave={({ hp, temp }) =>
            updateHp.mutate({
              newHp: normalizeNumber(hp),
              newTempHp: normalizeNumber(temp),
            })
          }
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
      {activeFight && showEnemyForm && (
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

      {activeFight && showEnemyHpModal && selectedEnemy && (
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
