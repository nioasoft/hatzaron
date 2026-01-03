# Action Required: Capital Declaration Office Management

No manual steps required for this feature.

All tasks can be implemented automatically.

---

## Notes

- Database tables already exist (`declarationStatusHistory`, `declarationCommunication`)
- Penalty fields already exist in `declaration` table
- All required shadcn components are already installed
- `date-fns` is already a project dependency

## Verification After Implementation

After implementation, verify the following manually:

- [ ] **Test status change flow** - Change status and verify history is recorded
- [ ] **Test WhatsApp button** - Verify link opens WhatsApp with correct message
- [ ] **Test email reminder** - Verify email is sent and logged to communication history
- [ ] **Test portal auto-transition** - Access portal as new user, verify status changes to `in_progress`
- [ ] **Test penalty management** - Create a late submission and verify penalty form appears
