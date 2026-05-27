import { getDamage, getHitPower, getBlockPower } from './fight';

describe('Testing mathematical logic of combat in fight.js', () => {
  const mockAttacker = { attack: 10, defense: 4, health: 50 };
  const mockDefender = { attack: 8, defense: 5, health: 60 };

  test('getHitPower can rotate the values ​​between attack and attack * 2', () => {
    const power = getHitPower(mockAttacker);
    expect(power).toBeGreaterThanOrEqual(mockAttacker.attack);
    expect(power).toBeLessThanOrEqual(mockAttacker.attack * 2);
  });

  test('getBlockPower can rotate the values ​​between defense and defense * 2', () => {
    const power = getBlockPower(mockDefender);
    expect(power).toBeGreaterThanOrEqual(mockDefender.defense);
    expect(power).toBeLessThanOrEqual(mockDefender.defense * 2);
  });

  test('getDamage can be rotated to 0 because the strength of the block offsets the strength of the hit', () => {
    const weakAttacker = { attack: 1 };
    const strongDefender = { defense: 40 };
    const damage = getDamage(weakAttacker, strongDefender);
    expect(damage).toBe(0);
  });

  test('getDamage can correctly calculate damage and rotate the number', () => {
    const damage = getDamage(mockAttacker, mockDefender);
    expect(typeof damage).toBe('number');
    expect(damage).toBeGreaterThanOrEqual(0);
  });
});